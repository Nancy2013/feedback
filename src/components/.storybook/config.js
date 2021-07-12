import {
	configure,
	addDecorator,
	setAddon
} from '@storybook/react';
import React from 'react';
import './flexible';

import {
	configureViewport,
	withViewport
} from '@storybook/addon-viewport';
import {
	withKnobs,
	text,
	boolean,
	number
} from '@storybook/addon-knobs';
import styles from "@sambego/storybook-styles";
import JSXAddon from 'storybook-addon-jsx';
import {
	theme
} from '../package.json'
import LocaleProvider from '../LocaleProvider';
import infoAddon from '@storybook/addon-info';

const req = require.context('../.stories', true, /\.stories\.js$/);
console.error(req.keys());
// configureViewport({
// 	defaultViewport: 'iphone6'
// });

setAddon(infoAddon);


const LocaleProviderDecorator = (storyFn) => (
	<LocaleProvider>
        { storyFn() }
    </LocaleProvider>
);
console.log(configureViewport)
// addDecorator(withViewport('iphone6'));


addDecorator(LocaleProviderDecorator);
addDecorator(styles({
	// backgroundColor: theme['@theme-color'],
	backgroundColor: "#ccc",
	height: '500px',
}));
addDecorator(withKnobs);
setAddon(JSXAddon);
// addDecorator(withViewport('iphone5'));
function loadStories() {
	req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);