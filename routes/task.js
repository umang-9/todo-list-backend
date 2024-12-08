const router = require("express").Router();
const Task = require("../models/task");
const User = require("../models/user");
const [authenticationToken] = require("./auth");

// Create task
router.post("/create-task", authenticationToken, async (req,res) => {
    try {
        const { title, desc } = req.body;
        const { id } = req.headers;
        const newTask = new Task( {title: title, desc: desc });
        const saveTask = await newTask.save();
        const taskID = saveTask._id;
        await User.findByIdAndUpdate( id, { $push: {tasks: taskID._id }});
        return res.status(200).json({ message: "Task created successfully." });

    } catch(error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error." });
    }

})

// Display all task 
router.get("/get-all-task", authenticationToken, async (req,res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path: "tasks",
            options: { sort: {createdAt: -1 }},
        });
        return res.status(200).json({ data: userData });
    } catch(error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error." });
    }
});

//Remove task
router.delete("/delete-task/:id", authenticationToken, async (req,res) => {
    try {
        const { id } = req.params;
        const userId = req.headers.id;
        await Task.findByIdAndDelete(id);
        await User.findByIdAndUpdate(userId, { $pull: { tasks: id } }); 
        return res.status(200).json({ message: "Task deleted successfully." });
    } catch(error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error." });
    }
});

//Update task
router.put("/update-task/:id", authenticationToken, async (req,res) => {
    try {
        const { id } = req.params;
        const { title, desc } = req.body;
        await Task.findByIdAndUpdate(id, { title: title, desc: desc });
        return res.status(200).json({ message: "Task updated successfully." });
    } catch(error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error." });
    }
});

//Update Important task
router.put("/update-imp-task/:id", authenticationToken, async (req,res) => {
    try {
        const { id } = req.params;
        const TaskData = await Task.findById(id);
        const ImpTask = TaskData.important;
        await Task.findByIdAndUpdate(id, { important: !ImpTask });
        return res.status(200).json({ message: "Task updated successfully." });
    } catch(error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error." });
    }
});

//Update Complete task
router.put("/update-complete-task/:id", authenticationToken, async (req,res) => {
    try {
        const { id } = req.params;
        const TaskData = await Task.findById(id);
        const CompleteTask = TaskData.complete;
        await Task.findByIdAndUpdate(id, { complete: !CompleteTask });
        return res.status(200).json({ message: "Task updated successfully." });
    } catch(error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error." });
    }
});


// Display important task 
router.get("/get-imp-task", authenticationToken, async (req,res) => {
    try {
        const { id } = req.headers;
        const Data = await User.findById(id).populate({
            path: "tasks",
            match: {important:true},
            options: { sort: {createdAt: -1 }},
        });
        const ImpTaskData = Data.tasks;
        return res.status(200).json({ data: ImpTaskData });
    } catch(error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error." });
    }
});

// Display complete task 
router.get("/get-complete-task", authenticationToken, async (req,res) => {
    try {
        const { id } = req.headers;
        const Data = await User.findById(id).populate({
            path: "tasks",
            match: {complete:true},
            options: { sort: {createdAt: -1 }},
        });
        const CompleteTaskData = Data.tasks;
        return res.status(200).json({ data: CompleteTaskData });
    } catch(error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error." });
    }
});

// Display incomplete task 
router.get("/get-incomplete-task", authenticationToken, async (req,res) => {
    try {
        const { id } = req.headers;
        const Data = await User.findById(id).populate({
            path: "tasks",
            match: {complete:false},
            options: { sort: {createdAt: -1 }},
        });
        const InCompleteTaskData = Data.tasks;
        return res.status(200).json({ data: InCompleteTaskData });
    } catch(error) {
        console.log(error);
        res.status(400).json({ message: "Internal server error." });
    }
});

module.exports = router;