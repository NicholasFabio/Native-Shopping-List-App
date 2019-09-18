# Shopping List

Electron JS Shopping List Application

Simple shopping list app. Items can be added and removed. Removeing an item is either done by clicking the clear items in the menu or by double clicking on an item. 

INSTALLTION: (Command Line)
First you will need to create a directory:

1. mkdir /Desktop/ShoppingList/

Install Node JS (I used Brew for MacOS): 

2.1 Windows: cinst nodejs.install
2.2 MacOS : brew install node

3. npm init (Add all neccesary project information)

Create Project structure and files

4. npm install --save electron 

Copy the Relavent Files into the root directory of project (/Desktop/ShoppingList/)

5. main.html main.js and newItem.html 

Run the App 

6. npm start

Package the App

First install the packager
7. npm install --save-dev electron-packager
8.1 Windows : npm run package-win
8.2 MacOS : npm run package-mac
