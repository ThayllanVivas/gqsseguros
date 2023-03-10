// export INTERFACE section
export interface HeaderProps {
    customersFSSP?: CustomerType[];
    tasksFSSP?: TaskType[];
    activePage: string;
}
export interface DashboardProps {
    tasksFSSP: TaskType[];
    customersFSSP: CustomerType[];
    categoriesFSSP: CategoryTypes[];
}
export interface NewCustomerProps {
    customersFSSP: CustomerType[];
}
export interface DashboardTaskBodyProps {
    date: string,
    tasks: TaskType[],
    customers: CustomerType[],
    handleOpenModalView: (task_id: string) => void,
    categoriesFSSP: CategoryTypes[]
}
export interface NewTaskProps {
    branchesFSSP: BranchTypes[];
    categoriesFSSP: CategoryTypes[];
    customersFSSP: CustomerType[];
}
export interface SignUpProps {
    notAdminUsersFSSP: UserType[];
    adminUsersFSSP: UserType[];
}
export interface SetTaskProps {
    searchInfo: string,
    customersFSSP: CustomerType[],
    tasksFSSP: TaskType[];
}
export interface ModalTaskProps{
    isOpen: boolean;
    user: UserType;
    users: UserType[];
    comments: CommentTypes[];
    customer: CustomerType;
    usersNotResponsable: UserType[];
    onRequestUpdateTask: () => void;
    onRequestClose: () => void;
    onRequestFinishUnfinish: (task) => Promise<void>;
    onRequestAddComent: (description: string) => Promise<void>;
    onRequestDeleteComment: (comment_id: string) => void;
  }

// export TYPE section
export type TaskType = {
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
export type SignUpTypes = {
    name: string,
    email: string,
    password: string
}
export type CommentTypes = {
    id: string,
    text: string,
    task_id: string,
    created_at: string
}
export type CustomerType = {
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
export type UserType = {
    id: string,
    name: string,
    email: string,
    status: boolean,
    admin_mode: boolean,
}
  
// //export extra TYPE section
// export type ChangeUserStatusType = {
//     id: string,
//     status: boolean
// }