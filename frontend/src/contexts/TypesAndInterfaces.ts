// export INTERFACE section
export interface HeaderProps {
    customerList?: CustomerTypes[];
    taskList?: TaskTypes[];
    activePage: string;
}
export interface DashboardProps {
    taskList: TaskTypes[];
    customerList: CustomerTypes[];
    categoryList: CategoryTypes[];
}
export interface DashboardBodyProps {
    taskList: TaskTypes[],
    customerList: CustomerTypes[],
    categoryList: CategoryTypes[]
}
export interface DashboardTaskBodyProps {
    date: string,
    tasks: TaskTypes[],
    customers: CustomerTypes[],
    handleOpenModalView: (task_id: string) => void,
    categoryList: CategoryTypes[]
}
export interface NewTaskProps {
    branchList: BranchTypes[];
    categoryList: CategoryTypes[];
    customerList: CustomerTypes[];
}
export interface SignUpProps {
    usersList: UsersType[]
}
export interface SetTaskProps {
    searchInfo: string,
    customerList: CustomerTypes[],
    taskList: TaskTypes[];
}

// export TYPE section
export type TaskTypes = {
    id: string,
    status: boolean,
    description: string,

    vehicleName: string,
    vehiclePrice: string,
    vehicleYear: string,

    user_id: string,
    branch_id: string,
    category_id: string,
    customer_id: string,
    created_at: string
}
export type CommentTypes = {
    id: string,
    text: string,
    task_id: string,
    created_at: string
}
export type CustomerTypes = {
    id: string,
    cpf: string,
    name: string,
    phoneNumber: string
}
export type CategoryTypes = {
    id: string,
    name: string
}
export type BranchTypes = {
    id: string;
    name: string;
}
export type UsersType = {
    id: string,
    name: string,
    email: string,
    admin_mode: boolean,
    status: boolean
}
  
//export extra TYPE section
export type ChangeUserStatusType = {
    id: string,
    status: boolean
}
export type UserInfoType = {
    id: string,
    name: string,
    email: string,
    admin_mode: boolean
}