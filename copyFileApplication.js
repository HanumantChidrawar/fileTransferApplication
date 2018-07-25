// import all the required modules

const fs = require('fs');
const readLine = require('readline');

const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});//end createInterface

let Allfiles;
let path;
let filename;

let getDirectoryName = () => {// This function will take the directory name from user as its complete path.

    rl.question('Enter the name of directory with its path: ', (answer) => {

        console.log(`Thank You I will open the directory: ${answer}`);
        readDirectoryAsynchronously(answer);//reading the directory asynchronously.
    });//end question

}

let readDirectoryAsynchronously = (dirName) => {//function to read the directory using asynchronous method

    fs.readdir(dirName, (err, files) => {
        if (err) {//if unable to find the direcory whoose name is provided get another name.
            console.log(err);
            console.log("No Such Directory found. Enter the complete name of directory without qoutes");

            getDirectoryName();
        }
        else {// if found then will display only the files in the directory not other directoies in it.
            //Allfiles = files;
            Allfiles = [];
            if (files.length === 0) {
                console.log("Source directory is empty.")
                console.log("Enter another directory name to copy a file from");
                getDirectoryName();
            }
            else {
                for (file of files) {

                    if (file.toString().indexOf('.') != -1) {
                        Allfiles.push(file);
                    }
                }
                path = dirName;
                console.log("Directory contains following files");
                let count = 0;
                for (file of Allfiles) {// to display the number along with file name to choose it correctly
                    count++
                    console.log(`${count}. ${file}`);
                }
                getNumberToOpenFile();
            }
        }
    })//end readdir

}//end readDirectoryAsynchronously

let getNumberToOpenFile = () => {//this function will get the number associated with file to copy to destination.

    rl.question('Enter the number associated with file to open: ', (answer) => {

        filename = Allfiles[answer - 1];
        let tmppath = `${path}\\${Allfiles[answer - 1]}`;//creating the path to copy from

        getDestinationDirectory(tmppath);
    })//end question

}

getDestinationDirectory = (finalPath) => {//this function will get the destionation directory to copy the file to.
    rl.question("Enter the destination Directory: ", (dirName) => {

        fs.readdir(dirName, (err, files) => {
            if (err) {//this will create the directory entered by user if not found

                console.log("No Such Directory found. Creating the directory.");
                fs.mkdir(dirName, (err) => {
                    if (err) {//if not able to create the destination directory then ask for another destination directory.
                        console.log("Unable to create the destination directory. please give another directory")
                        getDestinationDirectory();
                    }
                    else {//created the desination directory then copy the file to it.
                        copyFile(finalPath, dirName);
                    }
                })//end mkdir                
            }
            else {//if destination path exists then copy the file to it.
                copyFile(finalPath, dirName);
            }
        })//end readdir
        rl.close();//closing the input 
    })//end question
}
let copyFile = (finalPath, destinationPath) => {//function to copy the source file to destination directory.

    let readStream = fs.createReadStream(finalPath)
    let writeStream = fs.createWriteStream(`${destinationPath}\\copied${filename}`)
    readStream.on('data', (chunk) => {
        writeStream.write(chunk)
    })
    readStream.on('end', () => {
        console.log('File Read Complete')
        writeStream.end()
        console.log('File Write & copy Complete')
        console.log("Please check the file in Destiantion Directory.");
    })

}//end copy File

module.exports = {
    getDirectoryName : getDirectoryName
}