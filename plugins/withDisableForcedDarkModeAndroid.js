const { createRunOncePlugin, withAndroidStyles, AndroidConfig } = require('@expo/config-plugins');

function setForceDarkModeToFalse(styles) {
  styles = AndroidConfig.Styles.assignStylesValue(styles, {
    add: true,
    parent: AndroidConfig.Styles.getAppThemeLightNoActionBarGroup(),
    name: `android:forceDarkAllowed`,
    value: "false",
  });
  return styles;
}

const withDisableForcedDarkMode = (config) => {
  return withAndroidStyles(config, setForceDarkModeToFalse);
};

module.exports = createRunOncePlugin(
  withDisableForcedDarkMode,
  'withDisableForcedDarkMode',
  '1.0.0'
);