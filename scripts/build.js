'use strict';

const program = require('commander');
program
    .version('0.1.0')
    .option('-J, --jd', '为京东平台打包')
    .option('-D, --dna', '为古北（博联）平台打包')
    .option('-G, --gome', '为国美平台打包')
    .option('-A, --andlink', '为移动（andlink）平台打包')
    .option('-d, --dev', '测试包')
    .option('-p, --prod', '正式发布包')
    .option('-c, --cp <dir>', '将编译结果拷贝到<dir>')
    .option('-k, --sourcemap', '保留sourcemaps(DNA平台的prod包默认不生成sourcemaps)')
    .option('-S, --stats', 'writeStatsJson')
    .parse(process.argv);

// Process CLI arguments
const writeStatsJson = program.stats;

const isEnvDevelopment = program.dev;
const isEnvProduction = program.prod;

// Do this as the first thing so that any code reading it knows the right env.
if (isEnvProduction) {
    process.env.BABEL_ENV = 'production';
    process.env.NODE_ENV = 'production';
} else {
    process.env.BABEL_ENV = 'development';
    process.env.NODE_ENV = 'development';
}

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
    throw err;
});

// Ensure environment variables are read.
require('../config/env');


const path = require('path');
const chalk = require('react-dev-utils/chalk');
const fs = require('fs-extra');
const PromiseFtp = require('promise-ftp');
const webpack = require('webpack');
const bfj = require('bfj');
const configFactory = require('../config/webpack.config');
const paths = require('../config/paths');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const printHostingInstructions = require('react-dev-utils/printHostingInstructions');
const FileSizeReporter = require('./FileSizeReporter');
const printBuildError = require('react-dev-utils/printBuildError');
const appPackage = require(paths.appPackageJson);

const measureFileSizesBeforeBuild =
    FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;
const useYarn = fs.existsSync(paths.yarnLockFile);

// These sizes are pretty large. We'll warn for bundles exceeding them.
const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

const isInteractive = process.stdout.isTTY;

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
    process.exit(1);
}

//当前平台
const iotPlatform = getPlatformFormArg(program);
process.env.IOT_PLATFORM = iotPlatform;
// Generate configuration
const config = configFactory(process.env.NODE_ENV, false, iotPlatform);

// We require that you explicitly set browsers and do not fall back to
// browserslist defaults.
const {checkBrowsers} = require('react-dev-utils/browsersHelper');
checkBrowsers(paths.appPath, isInteractive)
    .then(() => {
        //检查public目录下的strings.js与profile.js
        if (iotPlatform === 'dna' && !appPackage.supportCustomScene) {
            checkStringsFiles();
        }
        // First, read the current file sizes in build directory.
        // This lets us display how much they changed later.
        return measureFileSizesBeforeBuild(paths.appBuild);
    })
    .then(previousFileSizes => {
        // Remove all content but keep the directory so that
        // if you're in it, you don't end up in Trash
        fs.emptyDirSync(paths.appBuild);
        // Merge with the public folder
        copyPublicFolder();
        // Start the webpack build
        return build(previousFileSizes);
    })
    .then(
        ({stats, previousFileSizes, warnings}) => {
            if (warnings.length) {
                console.log(chalk.yellow('Compiled with warnings.\n'));
                console.log(warnings.join('\n\n'));
                console.log(
                    '\nSearch for the ' +
                    chalk.underline(chalk.yellow('keywords')) +
                    ' to learn more about each warning.'
                );
                console.log(
                    'To ignore, add ' +
                    chalk.cyan('// eslint-disable-next-line') +
                    ' to the line before.\n'
                );
            } else {
                console.log(chalk.green('Compiled successfully.\n'));
            }

            console.log('File sizes after gzip:\n');
            printFileSizesAfterBuild(
                stats,
                previousFileSizes,
                path.resolve(paths.appBuild),
                WARN_AFTER_BUNDLE_GZIP_SIZE,
                WARN_AFTER_CHUNK_GZIP_SIZE
            );
            console.log();

            const publicUrl = paths.publicUrl;
            const publicPath = config.output.publicPath;
            const buildFolder = path.relative(process.cwd(), paths.appBuild);
            printHostingInstructions(
                appPackage,
                publicUrl,
                publicPath,
                buildFolder,
                useYarn
            );

            //为了保持向后兼容，脚手架应该把public目录下的中文strings-zh.js或者strings-zh-xx.js之一拷贝到zh-cn目录下。
            if (iotPlatform === 'dna') {
                copyStringsFileToZhCn();
                if(program.prod && !program.sourcemap){
                    //删除目录下的sourcemaps目录
                    // fs.remove(path.join(paths.appBuild, 'zh-cn', 'sourcemaps'))
                    let rimraf = require('rimraf');
                    rimraf('build/zh-cn/**/*.map', function () {
                        console.log('sourcemap文件都已被删除');
                    })
                }
            }

            if (program.cp) {
                if (program.cp.startsWith('ftp')) {
                    uploadDirToFtp(paths.appBuild, program.cp)
                } else {
                    copyBuildFolder(program.cp);
                }
            }
        },
        err => {
            console.log(chalk.red('Failed to compile.\n'));
            printBuildError(err);
            process.exit(1);
        }
    )
    .catch(err => {
        if (err && err.message) {
            console.log(err.message);
        }
        process.exit(1);
    });

// Create the production build and print the deployment instructions.
function build(previousFileSizes) {
    console.log('Creating an optimized production build...');

    let compiler = webpack(config);
    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            let messages;
            if (err) {
                if (!err.message) {
                    return reject(err);
                }
                messages = formatWebpackMessages({
                    errors: [err.message],
                    warnings: [],
                });
            } else {
                messages = formatWebpackMessages(
                    stats.toJson({all: false, warnings: true, errors: true})
                );
            }
            if (messages.errors.length) {
                // Only keep the first error. Others are often indicative
                // of the same problem, but confuse the reader with noise.
                if (messages.errors.length > 1) {
                    messages.errors.length = 1;
                }
                return reject(new Error(messages.errors.join('\n\n')));
            }
            if (
                process.env.CI &&
                (typeof process.env.CI !== 'string' ||
                    process.env.CI.toLowerCase() !== 'false') &&
                messages.warnings.length
            ) {
                console.log(
                    chalk.yellow(
                        '\nTreating warnings as errors because process.env.CI = true.\n' +
                        'Most CI servers set it automatically.\n'
                    )
                );
                return reject(new Error(messages.warnings.join('\n\n')));
            }

            const resolveArgs = {
                stats,
                previousFileSizes,
                warnings: messages.warnings,
            };
            if (writeStatsJson) {
                return bfj
                    .write(paths.appBuild + '/bundle-stats.json', stats.toJson())
                    .then(() => resolve(resolveArgs))
                    .catch(error => reject(new Error(error)));
            }

            return resolve(resolveArgs);
        });
    });
}

function copyPublicFolder() {
    fs.copySync(paths.appPublic, paths.appBuild, {
        dereference: true,
        filter: file => file !== paths.appHtml,
    });
    //以下文件应该被压缩
    const needMinifyJsFiles = ['intl.js','errors.js'/*'profile.js'*/];

    const Terser = require("terser");
    needMinifyJsFiles.forEach(file=>{
        const jsCode = fs.readFileSync(path.join(paths.appPublic,file),'utf8');
        const result = Terser.minify(jsCode);
        fs.outputFileSync(path.join(paths.appBuild,file), result.code);
    });
}

function getPlatformFormArg(argv) {
    const platforms = ['dna', 'jd', 'gome', 'andlink'];
    for (let i = 0; i < platforms.length; i++) {
        if (argv[platforms[i]]) {
            console.error('指定平台为:' + platforms[i]);
            return platforms[i];
        }
    }
    return appPackage.iotPlatform || 'dna';
}

function copyBuildFolder(destination) {
    try {
        if (!destination || !path.isAbsolute(destination)) {
            console.log(chalk.red('cp 参数需要接受一个绝对路径\n拷贝失败，请手动操作'));
            return;
        }
        console.log(chalk.yellowBright('正在拷贝到:' + destination + '\n'));

        fs.emptyDirSync(destination);
        fs.copySync(paths.appBuild, destination, {
            dereference: true,
        });
        console.log(chalk.yellowBright('拷贝完成.\n'));
    } catch (e) {
        console.log(chalk.red('拷贝失败，请手动操作.\n'));
        console.error(e);
    }


}

//把指定目录上传到ftp服务器
async function uploadDirToFtp(localDir, ftpPath) {
    let ftp = new PromiseFtp();

    async function readDirRecursive(localDir) {
        const fileList = await fs.readdir(localDir);
        for (let i = 0; i < fileList.length; i++) {
            let name = fileList[i];
            let fullPath = path.resolve(localDir, name);
            let info = await fs.stat(fullPath);
            if (info.isDirectory()) {
                //在FTP上建立该目录
                await ftp.mkdir(name);
                //切换到当前目录
                await ftp.cwd(name);
                await readDirRecursive(fullPath);
                await ftp.cwd('..');
            } else {
                await ftp.put(fullPath, name);
                console.log("upload file: " + fullPath)
            }
        }
    }

    try {
        console.time('time consume');
        const ftpUrl = new URL(ftpPath);

        console.log(chalk.yellowBright('正在连接:' + ftpUrl.hostname + '\n'));
        await ftp.connect({
            host: ftpUrl.hostname,
            port: ftpUrl.port
        });
        console.log(chalk.yellowBright('正在上传到:' + ftpUrl.hostname + '\n'));
        //删除当前目录
        await ftp.rmdir(ftpUrl.pathname, true);
        //重建当前目录
        await ftp.mkdir(ftpUrl.pathname, true);
        //切换到当前目录
        await ftp.cwd(ftpUrl.pathname);

        await readDirRecursive(localDir);
        await ftp.end();
        ftp = null;
        console.log(chalk.yellowBright('上传完成.\n'));
        console.timeEnd('time consume');
    } catch (e) {
        console.log(chalk.red('上传失败，请手动操作.\n'));
        console.error(e)
    } finally {
        if (ftp) {
            await ftp.end();
        }
    }
}


function checkStringsFiles() {
    const vm = require('vm');

    function execJsFile(path) {
        const content = fs.readFileSync(path, 'utf8');
        const sandbox = Object.create(null);
        vm.runInNewContext(content, sandbox);
        return sandbox;
    }

    //https://tools.ietf.org/html/bcp47
    //shortest ISO 639 code
    //ISO 3166-1 code
    const reg = /strings(-\w{2,3})+\.js/i;
    const stringsFiles = fs.readdirSync(paths.appPublic).filter(reg.test.bind(reg));

    const profileFile = path.join(paths.appPublic, 'profile.js');

    if (!fs.existsSync(profileFile)) {
        throw new Error('public目录下缺少profile.js文件！');
    }

    if (stringsFiles.length === 0) {
        throw new Error('public目录下缺少strings文件！');
    }

    //判断所有的Intfs的key相等（数量与名称）
    const profileIntfs = execJsFile(path.join(paths.appPublic, 'profile.js')).PROFILE.suids[0].intfs;
    const stringsIntfsArr = stringsFiles.map(file => execJsFile(path.join(paths.appPublic, file)).STRINGS.intfs);

    for (let stringsIntfs of stringsIntfsArr) {
        let stringsIntfsKeys = Object.keys(stringsIntfs);

        if (Object.keys(profileIntfs).length !== stringsIntfsKeys.length) {
            throw new Error('strings文件与profile文件不匹配！');
        }

        for (let intfsKey of stringsIntfsKeys) {
            if (!profileIntfs[intfsKey]) {
                throw new Error('strings文件与profile文件内容不匹配！');
            }
        }
    }
}


function copyStringsFileToZhCn() {
    const reg = /strings-zh(-\w{2,3})*\.js/i;
    const stringsFiles = fs.readdirSync(paths.appPublic)
        .filter(reg.test.bind(reg))
        .sort((a, b) => a.length - b.length);

    if (stringsFiles.length === 0) {
        throw new Error('未能在public目录下找到中文的strings文件');
    }
    fs.copySync(path.join(paths.appPublic, stringsFiles[0]), path.join(paths.appBuild, 'zh-cn', 'strings.js'));
}
