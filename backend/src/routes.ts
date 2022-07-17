import isAuthenticated from './middlewares/isAuthenticated';

import { Router } from 'express';

import { UserController } from './controllers/UserController';
import { TaskController } from './controllers/TaskController';
import { CommentController } from './controllers/CommentController'
import { CategoryController } from './controllers/CategoryController';
import { CustomerController } from './controllers/CustommerController';
import { BranchesController } from './controllers/BranchesController';

const router = Router(); //to copy what is inside Router() into router const

// ROTA USER 
router.post("/signup", new UserController().UserCreate); //create new user 
router.post('/signin', new UserController().UserAuth) //make login
router.get("/me", isAuthenticated, new UserController().User); //access my profile
router.get("/users", isAuthenticated, new UserController().Users); //get all users
router.put('/user/status', isAuthenticated, new UserController().UserChangeStatus) //change user status

// ROTA CATEGORY
router.post("/category", isAuthenticated, new CategoryController().CategoryCreate) //create category
router.get("/categories", isAuthenticated, new CategoryController().Categories) //get all categories

// ROTA TASK
router.get("/task", isAuthenticated, new TaskController().Task) //get a specific task
router.get("/tasks", isAuthenticated, new TaskController().Tasks) //get all the task
router.post("/task", isAuthenticated, new TaskController().TaskCreate) //create a new task
router.put("/task/status", isAuthenticated, new TaskController().TaskChangeStatus) //create a new task
router.get("/task/category", isAuthenticated, new TaskController().TasksByCategory) //get all the task of a specific category

// ROTA COMMENT
router.get("/comment", isAuthenticated, new CommentController().Comment) //get a specific comment inside database
router.put("/comment", isAuthenticated, new CommentController().CommentEdit) //create a comment inside database
router.post("/comment", isAuthenticated, new CommentController().CommentCreate) //create a comment inside database
router.get("/comments", isAuthenticated, new CommentController().Comments) //get all comments inside database
router.delete("/comment", isAuthenticated, new CommentController().CommentDelete) //delete a comment inside database

// ROTA CUSTOMER
router.get("/customers", isAuthenticated, new CustomerController().Customers) //get all customers inside database
router.post("/customer", isAuthenticated, new CustomerController().CustomerCreate) //create a customer inside database

// ROTA BRANCH
router.get("/branches", isAuthenticated, new BranchesController().Branches) //get all branches

export { router }; //to be visible on server.ts