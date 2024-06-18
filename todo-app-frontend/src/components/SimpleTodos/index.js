import './index.css'
// import {Component} from 'react'
import { useState, useEffect } from 'react';
import TodoItem from '../TodoItem'
import axios from 'axios';
import {ColorRing} from 'react-loader-spinner'

// const initialTodosList = [
//   {
//     id: 1,
//     title: 'Book the ticket for today evening',
//   },
//   {
//     id: 2,
//     title: 'Rent the movie for tomorrow movie night',
//   },
//   {
//     id: 3,
//     title: 'Confirm the slot for the yoga session tomorrow morning',
//   },
//   {
//     id: 4,
//     title: 'Drop the parcel at Bloomingdale',
//   },
//   {
//     id: 5,
//     title: 'Order fruits on Big Basket',
//   },
//   {
//     id: 6,
//     title: 'Fix the production issue',
//   },
//   {
//     id: 7,
//     title: 'Confirm my slot for Saturday Night',
//   },
//   {
//     id: 8,
//     title: 'Get essentials for Sunday car wash',
//   },
// ]

// Write your code here

const states = {
    inProgrss: "LOADING",
    success: "SUCCESS",
    fail: "FAILED"
}

const SimpleTodos = () => {
    const [inputData, setInputData] = useState("")
    const [list, setList] = useState([])
    const [status, setStatus] = useState(states.inProgrss)

    const onChangeInput = event => {
        setInputData(event.target.value)
    }
    
    const fetchAllTasks = async () => {
        try{
            const {data} = await axios.get("http://localhost:3001/tasks");
            setList(data)
            setStatus(states.success)
        }
        catch(err){
            console.log(`Error Ouccred: ${err}`);
            return err;
        }
    };
    const onAddNewTask = async () => {
        
        try{
            setInputData("")
            setStatus(states.inProgrss)
            const response = await axios.post(`http://localhost:3001/tasks`, { description: inputData });
            console.log(response.data)
            if (response.ok){
                fetchAllTasks();
                

            }
        }
        catch(err){
            console.log(`Error Adding Task: ${err}`)
            return err
        }
    };
    const deleteTodo = async (todoId) => {
        setStatus(states.inProgrss)
        try{
            await axios.delete(`http://localhost:3001/tasks/${todoId}`);
            fetchAllTasks()

        }
        catch(err){
            console.log(`Error While Deleting: ${err}`)
        }
        
    };
    const checkTask = async (id) => {
        setStatus(states.inProgrss)
        const task = list.find(each => each.id === id)
        try{
            await axios.put(`http://localhost:3001/tasks/${id}`, { completed: !task.completed});
            fetchAllTasks()
        }
        catch(err){
            console.log(`Error While Deleting: ${err}`)
        }
    };
    const onSaveExitingTask = (id, taskTitle) => {
        const newUpdatedList = list.map(each => {
          if (each.id === id) {
            return {...each, title: taskTitle}
          } else {
            return each
          }
        });
        setList(newUpdatedList);
    }

    
    useEffect(() => {
        fetchAllTasks()
    }, [list])

    const renderLoader =  () =>{
        return(
            <div className='loader-container'><ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperClass="color-ring-wrapper"
            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
            />
          </div>
        )
    }

    
    const renderTodoList = () => {   
        return (
            <ul className='todo'>
                {list.map(eachTodo => (
                    <TodoItem
                    key={eachTodo.id}
                    todoList={eachTodo}
                    onEditedTask={onSaveExitingTask}
                    deleteTodo={deleteTodo}
                    onCheckTask={checkTask}
                    />
                ))}
            </ul>
        )
    }
    
    const diffrentStates = () => {
        switch(status){
            case(states.inProgrss):
                return renderLoader()
            case(states.success):
                return renderTodoList()
            case(states.fail):
                return <p>Network Failed .....</p>
            default:
                return <p>Nothing</p>
        }
    }


    return (
    <div className='bg-container'>
        <div className='todo-card'>
          <h1 className='heading'>Simple Todos</h1>
          <div className='input-div-container'>
            <input
              type='text'
              className='input'
              placeholder='Add Task'
              value={inputData}
              onChange={onChangeInput}
            />
            <button onClick={onAddNewTask} className='add-task-btn'>
              Add
            </button>
          </div>
          {diffrentStates()}
        </div>
        
      </div>
    )
}


export default SimpleTodos;


// class SimleTodos {
//   state = {
//     todoList: [],
//     inputData: '',
//     status: states.inProgrss
//   }

//   componentDidMount = () => {
//     this.fetchAllTasks()
//   }


  
  
 

  



//   diffrentStates = () => {
//     const {status} = this.state;
//     switch(status){
//         case(states.inProgrss):
//             return this.renderLoader()
//         case(states.success):
//             return this.renderTodoList()
//         case(states.fail):
//             return <p>Network Failed .....</p>
//     }
//   }




//   render() {
//     const {todoList, inputData, isEdit} = this.state
//     console.log(todoList)
//     return (
//       <div className='bg-container'>
//         <div className='todo-card'>
//           <h1 className='heading'>Simple Todos</h1>
//           <div className='input-div-container'>
//             <input
//               type='text'
//               className='input'
//               placeholder='Add Task'
//               value={inputData}
//               onChange={this.onChangeInput}
//             />
//             <button onClick={this.onAddNewTask} className='add-task-btn'>
//               Add
//             </button>
//           </div>
//           {this.diffrentStates()}
//         </div>
        
//       </div>
//     )
//   }
// }

// export default SimpleTodos
