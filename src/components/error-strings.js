import getI18nBundle from "./get-i18n-bundle";

const errorStrings =window.__ERRORS_STRINGS__ ? getI18nBundle(window.__ERRORS_STRINGS__):null;

export default errorCode => errorStrings? errorStrings[errorCode]:null;