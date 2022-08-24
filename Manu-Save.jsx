manuSave();

function manuSave(){
    if(app.project == null){return(alert("Make sure you have a project open."))} //Make sure there's a project
    if(app.project.dirty){ //If unsaved
        try{
            app.executeCommand(5); //Save
            if(app.project.dirty){ //If still unsaved
                return(alert("This project could not be saved. Make sure you have the necessary disk space and permissions."));
            }
        }catch(e){ //Yeah, this isn't saving
            return(alert("This project could not be saved. Make sure you have the necessary disk space and permissions."));
        }
    }
    var originalFile = app.project.file; //This project file.
    var originalFileLocation = app.project.file.path.toString(); //The directory containing this project file
    var originalFileName = originalFile.name.toString().replace(/.aep/gi,""); //Get the file name, but ditch the extension
    var originalFileNameClean = originalFileName.replace(/Auto-Save/gi,""); //Get rid of "Auto-Save" in the name
    var originalFileNameClean = originalFileNameClean.replace(/^%20+|%20+|%20+(?=%20)/gi,""); //Get rid of any leading or trailing spaces
    var autoSaveLocation = originalFileLocation+"/"+"Adobe After Effects Auto-Save"; //Define the auto-save folder
    if(!autoSaveLocation.exists){Folder(autoSaveLocation).create()} //If the auto-save folder is non-existant, create it
    var getAutoSaves = Folder(autoSaveLocation).getFiles(); //Grab what's in the auto-save folder

    var maxNum = 0; //We're gonna use this variable to number the auto-save
    var currFileNum = 0; //This will hang on to each number we find for comparison
    for(f=0; f < getAutoSaves.length; f++){ //Go through the files
        var currFile = getAutoSaves[f]; //This variable is the current file for this loop
        var currFileName = currFile.name.replace(/%20/gi," "); //Un-encode the space characters
        if(currFileName.indexOf("Auto-Save") != -1){ //Make sure this file name contains "Auto-Save"
            currFileNum = currFileName.split("Auto-Save")[1].replace(/\s/gi,"").replace(/[^0-9]/gi,""); //Grab everything after the first instance of "Auto-Save"
        }
        if(eval(currFileNum) > maxNum && currFileName.indexOf(originalFileNameClean) != -1){ //If this number is larger, and the file appears to be an auto-save of the current project, update the maxNum
            maxNum = eval(currFileNum); //Interpret the number from the file name as a number
        }
        if(maxNum != 0){ //If it's not zero
            if(maxNum/maxNum != 1){ //Make sure it's an integer
                maxNum = 0; //If not, just use zero
            }
        }
    }
    var newFile = File(autoSaveLocation+"/"+originalFileNameClean+" "+"Auto-Save"+" "+(maxNum+1)+""+".aep"); //Define the auto-save file
    if(!newFile.exists){ //Make sure it doesn't already exist
    app.project.save(newFile); //Save the project there
    }
    if(originalFile.exists){ //If the original project file still exists (It should)
    app.open(originalFile); //Open it back up
    }
}