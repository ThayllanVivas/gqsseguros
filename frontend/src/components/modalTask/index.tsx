import Modal from 'react-modal';
import Styles from './styles.module.scss';

import { useState } from 'react';
import { FiTrash2, FiX } from 'react-icons/fi'
import { TaskTypes, CommentTypes, CustomerTypes } from '../../pages/dashboard'
import { setupAPIClient } from '../../services/api';

interface ModalTaskProps{
  isOpen: boolean;
  task: TaskTypes;
  comments: CommentTypes[];
  customersList: CustomerTypes[]
  onRequestClose: () => void;
  onRequestFinishUnfinish: (task) => Promise<void>;
  onRequestAddComent: (description: string) => Promise<void>;
  onRequestDeleteComment: (comment_id: string) => void;
}


export function ModalTask({isOpen, task, comments, customersList, onRequestClose, onRequestFinishUnfinish, onRequestAddComent, onRequestDeleteComment}: ModalTaskProps){

  const [description, setDescription] = useState('')
  const [modal_task, set_modal_task] = useState(task)
  const customer = customersList.find(customer => customer.id == task.customer_id)

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0,0,0, 0.9)'
    },
    content:{
      top: '50%',
      bottom: 'auto',
      left: '50%',
      right: 'auto',
      padding: '30px',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#1d1d2e'
    }
  };

  async function updateTask(){
    const api = setupAPIClient()
    const response  = await api.get("/task")
    const tasks_updated_data = response.data

    let filterTask = tasks_updated_data.find(taskHMM => taskHMM.id === task.id)
    set_modal_task(filterTask)
  }

  Modal.setAppElement('#__next'); //add the Modal to main id of the html page so it can work

  return(
   <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={customStyles}>

  
    <div className={Styles.container}>
      <div className={Styles.header}>
        <h2>Detalhes da tarefa</h2>
        <button
            type="button"
            className="react-modal-close"
            style={{ background: 'transparent', border:0 }}
            onClick={onRequestClose}
          >
            <FiX size={35} color="#f34748" />
        </button>
      </div>  

        <section className={Styles.containerItem}>          
          <div id={Styles.taskInfo}>

            {/* sobre ASSEGURADO */}

            <div className={Styles.sonOfTaskInfo}>
              <div className={Styles.propertyInfo}>
                <p className={Styles.details}>Assegurado:</p> 
              </div>

              <div className={Styles.descriptionInfo}>
                <span>{customer.name.toLocaleUpperCase()}</span>
              </div>
            </div>

            {/* sobre CARRO */}

            <div className={Styles.sonOfTaskInfo}>
              <div className={Styles.propertyInfo}>
                <p className={Styles.details}>Carro [NOME]:</p> 
              </div>

              <div className={Styles.descriptionInfo}>
                <span>{task.vehicleName.toUpperCase()}</span>
              </div>
            </div>

            {/* sobre ANO do carro */}

            <div className={Styles.sonOfTaskInfo}>
              <div className={Styles.propertyInfo}>
                <p className={Styles.details}>Carro [ANO]:</p>
              </div>

              <div className={Styles.descriptionInfo}>
                <span>{task.vehicleYear}</span>
              </div>
            </div>

            {/* sobre VALOR do carro */}

            <div className={Styles.sonOfTaskInfo}>
              <div className={Styles.propertyInfo}>
                <p className={Styles.details}>Carro [FIPE]:</p>
              </div>

              <div className={Styles.descriptionInfo}>
                <span>R$ {task.vehiclePrice}</span>
              </div>
            </div>

            {/* sobre DESCRIÇÃO */}

            {task.description && (
              <div className={Styles.sonOfTaskInfo}>
                <div className={Styles.propertyInfo}>
                  <p className={Styles.details}>Descrição:</p>
                </div>
                <div className={Styles.descriptionInfo}>
                  <span>{task.description}</span>
                </div>
              </div>
            )}
          </div>

          <hr />

          <div id={Styles.taskCommentsContainer}>
              {comments.length == 0 ? (
                <>
                  <h4>Nenhum comentário encontrado</h4>
                </>
              ):(
                <>
                  <h4>Histórico de comentários</h4>
                </>
              )}
              {comments.map((comment, index) => {
                
                // convert date from object to string to show
                let timeSlamp = new Date(comment.created_at)
                let localeDateString = timeSlamp.toLocaleDateString()
                let localeTimeString = timeSlamp.toLocaleTimeString()
                let dateTimeComment = [] 
                dateTimeComment.push(localeDateString)
                dateTimeComment.push(localeTimeString)
                let dateTime = dateTimeComment.join(' ')

                return (
                  <>
                    <div key={comment.id}>
                      <p className={Styles.commentsContainer}>
                        <span>{dateTime}: </span> {comment.text}
                      </p>
                      {modal_task.status ? (<></>) : (
                        <button className={Styles.deleteCommentButton} onClick={(event) => {
                          event.preventDefault() 
                          onRequestDeleteComment(comment.id)
                        }}>
                          <FiTrash2 />
                        </button>
                      )}
                    </div>
                  </>
                )
                })}
            </div>

            <hr />
            
        </section>



      <div>
        {
          !modal_task.status && (
            <form id={Styles.formSection}>
              <textarea 
                  className={Styles.textarea} 
                  placeholder="Insira comentários sobre progressão da tarefa"
                  value={description}
                  onChange={(e)=> {
                      setDescription(e.target.value)
                  }}
              />
            </form>
          )
        }
      </div>

      
      <div className={Styles.buttons}>
        {
          modal_task.status ? (
            <button id={Styles.addCommentGhost} onClick={(event) => event.preventDefault()}>
              
            </button>
          ) : (
            <button id={Styles.addComment} onClick={async () => {
              await onRequestAddComent(description)
              setDescription('')
              }}>
              Adicionar comentário
            </button>
          )
        }

        {
          modal_task.status ? (
            <button id={Styles.finishedTask} onClick={async () => {
              await onRequestFinishUnfinish(modal_task)
              await updateTask()
              }}>
              Desfazer conclusão
            </button>
          ) : (
            <button id={Styles.finishTask} onClick={async () => {
              await onRequestFinishUnfinish(modal_task)
              await updateTask()
              }}>
              Concluir tarefa
            </button>
          )
        }
      </div>

    </div>

   </Modal>
  )
}
