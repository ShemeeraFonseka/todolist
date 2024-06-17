import React, { useEffect, useState } from "react";
import "./Tasks.css";
import { CiSquarePlus } from "react-icons/ci";
import { RiDeleteBin6Line, RiEditLine } from "react-icons/ri";
import ReactSwitch from 'react-switch';

const Tasks = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const [tasks, setTasks] = useState([]);
    const [newTaskInput, setNewTaskInput] = useState("");

    useEffect(() => {
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    }, []);

    const addTask = () => {
        if (newTaskInput.trim() !== "") {
            const updatedTasks = [...tasks, { name: newTaskInput, completed: false }];
            setTasks(updatedTasks);
            localStorage.setItem("tasks", JSON.stringify(updatedTasks));
            setNewTaskInput("");
        }
    };

    const deleteTask = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks.splice(index, 1);
        setTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    };

    const completeTask = (index) => {
        const updatedTasks = [...tasks];
        updatedTasks[index].completed = !updatedTasks[index].completed;
        setTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    };

    const deleteCompletedTasks = () => {
        const updatedTasks = tasks.filter(task => !task.completed);
        setTasks(updatedTasks);
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    };

    useEffect(() => {
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); 
        if (currentDate.getTime() >= endOfDay.getTime()) {
            deleteCompletedTasks();
        }
    }, []);

    const handleInputChange = (event) => {
        setNewTaskInput(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            addTask();
        }
    };

    const editTask = (index) => { 
        const editedTodo = prompt('Edit the todo:', tasks[index].name); 
        if (editedTodo !== null && editedTodo.trim() !== '') { 
            const updatedTasks = [...tasks];
            updatedTasks[index].name = editedTodo;
            setTasks(updatedTasks);
            localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        } 
    } 

    return (
        <div className="task-container">
            <div className="day-container">
                <div><h1>Day Planner</h1></div>
                <div className="today">Today is {formattedDate}</div>
            </div>

            <div className="input-container">
                <div className="form__group field">
                    <input
                        type="input"
                        className="form__field"
                        placeholder="Add Task"
                        name="name"
                        id="name"
                        value={newTaskInput}
                        onChange={handleInputChange}
                        onKeyPress={handleKeyPress}
                        maxLength={175}
                        required
                    />
                    <label htmlFor="name" className="form__label">Add Task</label>
                </div>
                <div className="icon-container">
                    <div className="plus-icon" onClick={addTask}><CiSquarePlus /></div>
                </div>
            </div>

            <div className="tasks">
                {tasks.map((task, index) => (
                    <div key={index} className={`task-item ${task.completed ? 'completed' : ''}`}>
                        <span>{task.name}</span>
                        <div className="icons">
                            <button className="toggle-button">
                                <ReactSwitch
                                    checked={task.completed}
                                    onChange={() => completeTask(index)}
                                    onColor="#392467"
                                    offColor="#5D3587"
                                />
                            </button>
                            <button className="edit-button" onClick={() => editTask(index)}>
                                <RiEditLine />
                            </button>
                            <button className="delete-button" onClick={() => deleteTask(index)}>
                                <RiDeleteBin6Line />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tasks;
