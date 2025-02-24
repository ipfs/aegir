# Spelling

The `aegir spell-check` command will run [cspell](https://cspell.org/) over the
current module.

By default it will spell check all `.ts`, `.js` and `.md` files not in `dist` or
`node_modules` except `CHANGELOG.md` because it is automatically generated.

A [default dictionary](../dictionaries/ipfs.txt) is provided, additional
dictionaries can be configured in your project's `.cspell.json` file.

Cspell can be configured by passing forward args to the command. E.g.:

```console
% aegir spell-check -- [cspell args here]
```

## Configuration

1. Create a `./.github/dictionary.txt` file to hold custom words for your
project.
2. Create a `.cspell.json` file in the root of your repo. Configure it to load the default aegir config and your custom dictionary:
    ```json
    {
      "import": [
        "./node_modules/aegir/cspell.json"
      ],
      "dictionaries": ["project"],
      "dictionaryDefinitions": [{
        "name": "project",
        "path": "./.github/dictionary.txt",
        "addWords": true
      }]
    }
    ```

## VSCode

Load the cspell config by putting this in your `.vscode/settings.json`:

```
{
  "cSpell.import": [
    "${workspaceFolder}/.cspell.json"
  ]
}
```

## GitHub actions

To test spelling in CI:

1. Add a `spell-check` script to your `package.json`:
    ```
    "spell-check": "aegir spell-check"
    ```
2. If running `js-test-and-release.yml` there's nothing else to do, otherwise add it to your workflow somewhere:
    ```
    - run: npm run --if-present spell-check
    ```

## Tips

- Words in backticks are ignored so if you need to use a word in a markdown file or comment with a strange spelling `put it in backtickz`
- Camel case words are examined independently so prefer e.g. `maxSize` over `maxsize`
- Capitalization implies a new word so break all-caps up with `_`, e.g. prefer `MAX_SIZE` over `MAXSIZE`
- The spell check can be disabled with `// spell-checker: disable-next-line` or `/* spell-checker: disable */` for a whole file
