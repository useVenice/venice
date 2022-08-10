module.exports = {
  /** @param {string[]} filenames */
  '**/*.{js,ts,tsx}': (filenames) => [
    `eslint --ext .js,.ts,.tsx --cache --fix ${filenames.join(' ')}`,
    `prettier --write ${filenames.join(' ')}`,
  ],
  '**/*.{json,yml,yaml}': ['prettier --write'],
}
