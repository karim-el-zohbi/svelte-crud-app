<script>
	import {  doc, setDoc } from "firebase/firestore";
	import { db } from "../../lib/firebase/firebase";
	import { authHandlers, authStore } from "../../store/store";
    import TodoItem from "../../componenet/TodoItem.svelte";

    // component state variables
    let todoList = [];
    let currTodo = "";
    let error = false;

    // subscribe to auth store to get user data
    authStore.subscribe(curr => {
        todoList = curr.data.todos;
    });
    // function to add a new todo item
    function addTodo() {
        // reset error state
        error = false;
        // validate input
        if (!currTodo){
            error = true;
            return;
        }
        // add new todo to the list
        todoList = [...todoList, currTodo]
        currTodo ="";
    }
    // function to edit an existing todo item
    function editTodo(index) {
        let newTodoList = [...todoList].filter((val, i) => {
            // filter out the todo at the specified index
            return i != index;
        });
        // set current todo to the one being edited
        currTodo = todoList[index];
        todoList = newTodoList;
    }
    // function to remove a todo item
    function removeTodo(index) {
         let newTodoList = [...todoList].filter((val, i) => {
            // filter out the todo at the specified index
            return i != index;
        });
        // update the todo list
        todoList = newTodoList;
    }
    // function to save todos to Firestore
    async function saveTodos() {
        try{
            // get user reference
            const userRef = doc(db, 'user', $authStore.user.uid)
            // save updated todo list
            await setDoc(userRef, 
                {
                    todos: todoList,
               
            },
            // merge with existing data
            {merge: true});
            
        }catch(err){
            // handle save errors
            console.log("save your info")
        }
    }
</script>
{#if !$authStore.loading}



<div class="mainContainer">
    <div class="headerContainer">
        <h1>Todo List</h1>
        <div class="headerButtons">
        <button on:click={saveTodos}> 
            <i class="fa-regular fa-floppy-disk"></i>
             <p> Save</p>
            </button>
            <button on:click={authHandlers.logout}>
                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                Logout
            </button>

        </div>
    </div>
    <main>
        {#if todoList == 0}
        <p>
          You Have Nothing To Do  
        </p>
        {/if}
        {#each todoList as todo, index }
       <TodoItem {todo} {index} {removeTodo} {editTodo}/>
        {/each}
    </main>
     <div class={"enterTodo" + (error ? 'errorBorder': "")}   >
            <input bind:value={currTodo} type="text" placeholder="enter todo" />
            <button on:click={addTodo}>ADD</button>
    </div>

</div>
{/if}

<style>
    .mainContainer{
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        gap: 24px;
        padding: 24px;
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
    }
    .headerContainer{
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .headerContainer button {
        background: #003c5b;
        border: none;
        color: white;
        padding: 10px 18px;
        border-radius: 4px;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
    }

    .headerContainer button i {
        font-size: 1.1rem;
    }

    .headerContainer button:hover{
        opacity: 0.7;
    }

    .headerButtons{
        display: flex;
        align-items: center;
        gap: 14px;

    }

    main{
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;
    }

    .todo{
        border-left: 1px solid cyan ;
        padding: 8px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

   
    
    .enterTodo{
        display: flex;
        align-items: stretch;
        border: 1px solid #0891b2;
        border-radius: 5px;
        overflow: hidden;
    }

    .errorBorder{
        border-color: coral !important;

    }
    .enterTodo input {
        background: transparent;
        border: none;
        padding: 14px;
        color: white;
        flex: 1;
    }
    .enterTodo input:focus{
        outline: none;
    }
    .enterTodo button{
        padding: 0 28px;
        background: #003c5b;
        border: none;
        color: cyan;
        font-weight: 600;
        cursor: pointer;

    }
    .enterTodo button:hover {
        background: transparent;
    }
</style>