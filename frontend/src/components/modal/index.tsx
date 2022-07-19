import Modal from 'react-modal';
import Styles from './styles.module.scss';
import { useState } from 'react';
import { FiTrash2, FiX } from 'react-icons/fi';
import { ModalTaskProps } from '../../contexts/TypesAndInterfaces';

export function ModalComponent(
  {isOpen, 
    user, 
    task, 
    comments, 
    customer, 
    onRequestUpdateTask, 
    onRequestClose, 
    onRequestFinishUnfinish, 
    onRequestAddComent, 
    onRequestDeleteComment}: ModalTaskProps){

  const [comment, set_Comment] = useState('')

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

  Modal.setAppElement('#__next'); //add the Modal to main id of the html page so it can work

  return(
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>

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
                  <span>{customer?.name.toLocaleUpperCase()}</span>
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
                        {task.status && user.admin_mode && (
                          <>
                          </>
                        )}
                        {task.status && !user.admin_mode && (
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


        {
          !user.admin_mode && (
            <div>
              {
                !task.status && (
                  <form id={Styles.formSection}>
                    <textarea 
                        className={Styles.textarea} 
                        placeholder="Insira comentários sobre progressão da tarefa"
                        value={comment}
                        onChange={(e)=> {
                            set_Comment(e.target.value)
                        }}
                    />
                  </form>
                )
              }
          </div>
          )
        }

        {
          !user.admin_mode && (
            <div className={Styles.buttons}>
              {
                task.status ? (
                  <button id={Styles.addCommentGhost} onClick={(event) => event.preventDefault()}>
                    
                  </button>
                ) : (
                  <button id={Styles.addComment} onClick={async () => {
                    await onRequestAddComent(comment)
                    set_Comment('')
                    }}>
                    Adicionar comentário
                  </button>
                )
              }

              {
                task.status ? (
                  <button id={Styles.finishedTask} onClick={async () => {
                    await onRequestFinishUnfinish(task)
                    await onRequestUpdateTask()
                    }}>
                    Desfazer conclusão
                  </button>
                ) : (
                  <button id={Styles.finishTask} onClick={async () => {
                    await onRequestFinishUnfinish(task)
                    await onRequestUpdateTask()
                    }}>
                    Concluir tarefa
                  </button>
                )
              }
          </div>
          )
        }
        
      </div>

    </Modal>
  )
}
