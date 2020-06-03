/**
 * 按需加载 antd-mobile
 */

const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd-mobile',
        style: true,
    }),     
    addLessLoader({
		javascriptEnabled: true,
		modifyVars: { 
            "@brand-primary": "#1cae82",
            "@brand-primary-tap": "#1DA57A",
            "color-text-base":  "#333",
            "@font-size-icontext": "14px",
            "@font-size-caption-sm": "14px",
            "@font-size-base": "14px",
            "@font-size-subhead": "14px",
            "@font-size-caption": "14px",
            "@font-size-heading": "14px",
        },
	}),
);
