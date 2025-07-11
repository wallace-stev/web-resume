# web-resume
A customizable template to host a personal page about yourself on Github pages.


## Environment Setup
- [Install node & npm](https://nodejs.org/en/download)
- Install an IDE of your choice (preferrably [Visual Studio Code](https://code.visualstudio.com/download))

## Optional Setup
- Install the Live Server VS Code extension for live previews ([see instructions](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer))
- Install the Browse Lite VS Code extension to preview in VS Code ([see instructions](https://marketplace.visualstudio.com/items?itemName=antfu.browse-lite))


## Contribution
A guide for those wanting to contribute to the project:

[![indentation](https://img.shields.io/badge/indentation-tabs-brightgreen)](https://www.codementor.io/@aviaryan/tabs-v-s-spaces-an-analysis-on-why-tabs-are-better-96xr0bg32)


The project uses the following libraries/tools:
- Tailwind CSS ([see here](https://tailwindcss.com))

- Google Fonts ([see here](https://fonts.google.com))

## Installation & Usage
After installing and configuring the tools mentioned above, fork and clone the repository, and open the directory using the IDE of your choice. Follow the coding guide and inline comments when making changes to the code. It is advised to constantly build/compile your Tailwind output file as you make changes to the `style.css` file so the changes can be previewed in real time.  
  
To watch for changes and compile Tailwind CSS, run the command below in your terminal:
``` bash
npx @tailwindcss/cli --input ./src/style.css --output ./dist/output.css --watch
```

You can also remove the `--watch` flag and run the command below in your terminal when you're done with all the changes or everytime that you want to preview your changes.
``` bash
npx @tailwindcss/cli --input ./src/style.css --output ./dist/output.css
```

## Samples
- [Wallace S. Msagusa](#) (link coming!)
