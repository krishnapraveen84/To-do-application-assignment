import './index.css'
import {Component} from 'react'
import {v4 as uuidv4} from 'uuid'
import TodoItem from '../TodoItem'
import axios from 'axios';

const initialTodosList = [
  {
    id: 1,
    description: 'Book the ticket for today evening',
  },
  {
    id: 2,
    description: 'Rent the movie for tomorrow movie night',
  },
  {
    id: 3,
    description: 'Confirm the slot for the yoga session tomorrow morning',
  },
  {
    id: 4,
    description: 'Drop the parcel at Bloomingdale',
  },
  {
    id: 5,
    description: 'Order fruits on Big Basket',
  },
  {
    id: 6,
    description: 'Fix the production issue',
  },
  {
    id: 7,
    description: 'Confirm my slot for Saturday Night',
  },
  {
    id: 8,
    description: 'Get essentials for Sunday car wash',
  },
]
const api = "http://localhost:3001/tasks"
const deployedApi = "https://to-do-application-assignment.onrender.com/tasks"
// Write your code here
class SimpleTodos extends Component {
  state = {
    todoList: [],
    inputData: '',
  }
  
  componentDidMount = () => {
    this.fetchAllTasks()
  }

  fetchAllTasks = async () => {
    const response = await axios.get(api);
    if (response.status === 200){
        this.setState({todoList: response.data})
    }      
 };

  deleteTodo = async (todoId) => {
    const {todoList} = this.state
    const filteredUsersData = todoList.filter(each => each.id !== todoId)
    this.setState({
      todoList: filteredUsersData,
    })
    await axios.delete(`${api}/${todoId}`);      
  }
  onChangeInput = event => {
    this.setState({inputData: event.target.value})
  }
  onAddNewTask = async () => {
    const {inputData} = this.state
    
    const newArr = {id: uuidv4(), description: inputData}
    this.setState(prev => ({
        todoList: [...prev.todoList, newArr],
    }))
    await axios.post(api, { description: inputData })
    
  }
  onCheckTask = async (id) => {
    const {todoList} = this.state;
    const newArr = todoList.map(each => {
        if(each.id === id){
            return {...each, completed: !each.completed}
        }
        else{
            return each
        }
    })
    this.setState({todoList: newArr})

    const task = todoList.find(each => each.id === id)
    await axios.put(`${api}/${id}`, { completed: !task.completed});
  }


  onSaveExitingTask = async (id, taskTitle) => {
    const {todoList} = this.state
    const newUpdatedList = todoList.map(each => {
      if (each.id === id) {
        return {...each, description: taskTitle}
      } else {
        return each
      }
    })
    this.setState({todoList: newUpdatedList})
    await axios.put(`${api}/update/${id}`, {description: taskTitle})
  }
  render() {
    const {todoList, inputData, isEdit} = this.state
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
              onChange={this.onChangeInput}
            />
            <button onClick={this.onAddNewTask} className='add-task-btn'>
              Add
            </button>
          </div>
          <ul className='todo'>
            {todoList.map(eachTodo => (
              <TodoItem
                key={eachTodo.id}
                todoList={eachTodo}
                onEditedTask={this.onSaveExitingTask}
                deleteTodo={this.deleteTodo}
                onCheckTask={this.onCheckTask}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default SimpleTodos