import React from 'react';
import humanizeDuration from 'humanize-duration'
import moment from 'moment'
import {FormattedMessage,injectIntl} from 'react-intl'

export default injectIntl(
    ({time,action,intl})=>{
        const localeLowerCase = intl.locale.toLowerCase();
        const localeParts = localeLowerCase.split('-');
        let locale ;
        if(localeParts[0]==='zh'){
            locale = localeLowerCase === 'zh' || localeLowerCase === 'zh-cn'?
                'zh_CN':'zh_TW'
        }else{
            locale = localeParts[0];
        }
        const minutesTotal = time.diff(moment(),'minutes');

        const duration = humanizeDuration(moment.duration(minutesTotal+1, 'minutes').asMilliseconds(), {
            language: locale,
            units: ['d', 'h', 'm'],
            // delimiter: locale === "zh" ? '' : ' ',
            spacer: localeParts[0]==='zh' ? '' : ' ',
            round: true
        });


        return  <FormattedMessage id="internal.FromNowDescription.laterAction" values={{
            duration,
            action
        }}/>
    }
)