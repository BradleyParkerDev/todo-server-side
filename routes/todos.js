var express = require("express");
const { uuid } = require("uuidv4");
const { db } = require("../mongo");
var router = express.Router();



// GET ALL listeings  
router.get("/all", async (req,res,next) => {
    try {
        const todos = await db().collection("todos")
        .find({})
        .toArray();
        res.json({
            success: true,
            todos: todos,
        })
    } catch (error) {

        console.error(err);
        res.json({
            success: false, 
            error: err.toString()
        })
        
    }

})

router.post("/create-one", async (req,res,next) => {
    try {

        const newToDo = {
            id: uuid(),
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            isComplete: false,
            creationDate: new Date(),
            lastModified: new Date(),
            completedDate: null,
          };
        
        const saveResult = await db().collection("todos").insertOne(newToDo);
        console.log(saveResult);
        res.json({
            success:true,
            saveResult: saveResult
        })
    } catch (error) {
        console.error(err);
        res.json({
            success: false, 
            error: err.toString()
        })
        
    }
})


router.put("/update-one/:id", async (req, res, next) => {
    
    const verifyObjFields = () => {

        const setObj = {

		}

        //make sure the fields are undefined 
		if (req.body.title !== undefined) {
			setObj.title = req.body.title
		}

		if (req.body.description !== undefined) {
			setObj.description = req.body.description
		}

		if (req.body.priority !== undefined) {
			setObj.priority = req.body.priority
		}

		if (req.body.isComplete !== undefined) {
			if (req.body.isComplete === true) {
				setObj.isComplete = true
				setObj.completedDate = new Date()
			} else {
				setObj.isComplete = false
				setObj.completedDate = null
			}
		}

        return setObj;
        
    }
    
    try {

        const setObj = verifyObjFields();	

        console.log(setObj);
        const saveResult = await db().collection("todos").updateOne(
            {
                id: req.params.id,
            },
            {
                $set: setObj,
            }
        );

        console.log(saveResult);

        res.json({
        success: true,
        saveResult: saveResult,
        });
   } catch (err) {
    //In the catch block, we always want to do 2 things: console.log the error and respond with an error object
    console.error(err);
    res.json({
      success: false,
      error: err.toString(),
    });
  }
})

router.delete("/delete-one/:id", async (req,res, next) => {

    try {
        const deleteResult = db().collection("todos").deleteOne({
            id: req.params.id
        })
        
        res.json({
            success: true,
            deleteResult: deleteResult
        }) 
    } catch (error) {
        console.error(err);
        res.json({
            success: false, 
            error: err.toString()
        })
    }

})

module.exports = router;