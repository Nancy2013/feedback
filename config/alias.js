/*
 * @Author: your name
 * @Date: 2021-02-23 10:27:12
 * @LastEditTime: 2021-07-13 15:15:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \integrated-stove\config\alias.js
 */
const path = require('path');

const srcRoot = path.resolve(__dirname, '../src');

module.exports = () => ({
  '@': srcRoot,
  componentsPath: '@/components',
  viewsPath: '@/panel/views',
  stylesPath: '@/panel/styles',
  utilsPath: '@/panel/utils',
  configPath: '@/panel/config',
  servicesPath: '@/panel/services',
});
