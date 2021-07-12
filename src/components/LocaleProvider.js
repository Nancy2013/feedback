import React from 'react';
import {IntlProvider, addLocaleData} from 'react-intl'
import getI18nBundle,{browserLocale} from './get-i18n-bundle';

import zh from "react-intl/locale-data/zh";
import en from "react-intl/locale-data/en";
import ja from "react-intl/locale-data/ja";
import ko from "react-intl/locale-data/ko";
import fr from "react-intl/locale-data/fr";
import es from "react-intl/locale-data/es";
import pt from "react-intl/locale-data/pt";
import ru from "react-intl/locale-data/ru";
import ar from "react-intl/locale-data/ar";
import de from "react-intl/locale-data/de";
import hi from "react-intl/locale-data/hi";

/*
　汉语、英语、日语、韩语、法语、西班牙语、葡萄牙语、俄罗斯语、阿拉伯语、德语、印地语
*/
addLocaleData([...zh,...en,...ja,...ko,...fr,...es,...pt,...ru,...ar,...de,...hi]);

const supportedLocales  = {zh,en,ja,ko,fr,es,pt,ru,ar,de,hi};


const locale = (()=>{
    const language = browserLocale.toLowerCase().split('-')[0];
    if(supportedLocales[language]){
        return browserLocale;
    }
    return 'en';
})();

const messages = getI18nBundle(window.__APP_STRINGS__);

const LocaleProvider = ({children,defaultLocale='en'})=>{

    console.warn(`current browser language: ${browserLocale},choose '${locale}' as app language`);

    return (
        <IntlProvider locale={locale} defaultLocale={defaultLocale} messages={messages}>
            {children}
        </IntlProvider>
    );
};

export default LocaleProvider