import isAuthenticated from './middlewares/isAuthenticated';

import { Router } from 'express';
import { AuthUser_CONTROLLER } from './controllers/user/AuthUser_Controller'
import { CreateUser_CONTROLLER } from './controllers/user/CreateUser_Controller'
import { DetailsUser_CONTROLLER } from './controllers/user/DetailsUser_Controller';

import { ListCategory_CONTROLLER } from './controllers/category/ListCategory_Controller';
import { CreateCategory_CONTROLLER } from './controllers/category/CreateCategory_Controller';

import { ListTask_CONTROLLER } from './controllers/task/ListTask_Controller';
import { CreateTask_CONTROLLER } from './controllers/task/CreateTask_Controller';
import { FinishTask_CONTROLLER } from './controllers/task/FinishTask_Controller';
import { DeleteComment_CONTROLLER } from './controllers/comment/DeleteComment_Controller';
import { ListTaskSpecific_CONTROLLER } from './controllers/task/ListTaskSpecific_Controller';
import { ListTaskByCategories_CONTROLLER } from './controllers/task/ListTaskByCategories_Controller';

import { CreateComment_CONTROLLER } from './controllers/comment/CreateComment_Controller';
import { GetComment_CONTROLLER } from './controllers/comment/GetUserComment_Controller';

import { ListAllBranches_CONTROLLER } from './controllers/branch/ListAllBranches_Controller';

import { ListCustomer_CONTROLLER } from './controllers/customer/ListCustomer_Controller';
import { CreateCustomer_CONTROLLER } from './controllers/customer/CreateCustomer_Controller';
import { EditComment_CONTROLLER } from './controllers/comment/EditComment_Controller';
import { GetSpecificComment_CONTROLLER } from './controllers/comment/GetSpecificComment_Controller';

const router = Router(); //to copy what is inside Router() into router const

// ROTA USER 
router.get("/me", isAuthenticated, (new DetailsUser_CONTROLLER).handle); //access my profile
router.post("/signup", new CreateUser_CONTROLLER().handle); //create new user 
router.post("/signin", (new AuthUser_CONTROLLER).handle); //make login

// ROTA CATEGORY
router.get("/category", isAuthenticated, new ListCategory_CONTROLLER().handle) //list all categories
router.post("/category", isAuthenticated, (new CreateCategory_CONTROLLER).handle) //create category

// ROTA TASK
router.get("/task", isAuthenticated, new ListTask_CONTROLLER().handle) //list all the task
router.post("/task", isAuthenticated, new CreateTask_CONTROLLER().handle) //create a new task
router.get("/task/detail", isAuthenticated, new ListTaskSpecific_CONTROLLER().handle) //list a specific task
router.put("/task/finish-unfinish", isAuthenticated, new FinishTask_CONTROLLER().handle) //create a new task
router.get("/category/task", isAuthenticated, new ListTaskByCategories_CONTROLLER().handle) //list all the task of a specific category

// ROTA COMMENT
router.put("/comment", isAuthenticated, new EditComment_CONTROLLER().handle) //create a comment inside database
router.get("/comment", isAuthenticated, new GetComment_CONTROLLER().handle) //get a user comment inside database
router.post("/comment", isAuthenticated, new CreateComment_CONTROLLER().handle) //create a comment inside database
router.delete("/comment", isAuthenticated, new DeleteComment_CONTROLLER().handle) //delete a comment inside database
router.get("/comment/specific", isAuthenticated, new GetSpecificComment_CONTROLLER().handle) //get a specific comment inside database

// ROTA CUSTOMER
router.get("/customer", isAuthenticated, new ListCustomer_CONTROLLER().handle) //get all user inside database
router.post("/customer", isAuthenticated, new CreateCustomer_CONTROLLER().handle) //create a customer inside database

// ROTA BRANCH
router.get("/branch", isAuthenticated, new ListAllBranches_CONTROLLER().handle) //list all branches

export { router }; //to be visible on server.ts