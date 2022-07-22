import Modal from 'react-modal';
import STYLES from './styles.module.scss';
import { useEffect, useState } from 'react';
import { FiTrash2, FiX } from 'react-icons/fi';
import { ModalTaskProps, UserType } from '../../contexts/TypesAndInterfaces';

export function ModalComponent(
  {isOpen, 
    user, 
    task, 
    users,
    comments, 
    customer, 
    onRequestUpdateTask, 
    onRequestClose, 
    onRequestFinishUnfinish, 
    onRequestAddComent, 
    onRequestDeleteComment}: ModalTaskProps){

  const [comment, set_Comment] = useState('')
  const [taskResponsable, set_taskResponsable] = useState<UserType>()

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

  useEffect(() => {
    toGetTaskResponsable()
  }, [users])

  function toGetTaskResponsable(){
    const userFilter = users.find((user) => user.id == task.user_id)
    set_taskResponsable(userFilter)
  }

  Modal.setAppElement('#__next'); //add the Modal to main id of the html page so it can work

  return(
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>

      <div id={STYLES.modal}>
        <div id={STYLES.header}>
          <h2>DETALHES DA TAREFA</h2>
          <button
              type="button"
              className="react-modal-close"
              style={{ background: 'transparent', border:0 }}
              onClick={onRequestClose}
            >
              <FiX size={35} color="#f34748" />
          </button>
        </div>  

        <main id={STYLES.container}>
          <section id={STYLES.containerTask}> 
            {
              user.admin_mode && (
                <div id={STYLES.responsableInfo}>
                  <hr />
                  <h4>Responsável: {taskResponsable?.name.toLocaleUpperCase()}</h4> 
                  <hr />
                </div>
              )
            }         
            <div id={STYLES.taskInfo}>

              {/* sobre ASSEGURADO */}

              <div className={STYLES.sonOfTaskInfo}>
                <div className={STYLES.propertyInfo}>
                  <p className={STYLES.details}>Assegurado:</p> 
                </div>

                <div className={STYLES.descriptionInfo}>
                  <span>{customer?.name.toLocaleUpperCase()}</span>
                </div>
              </div>

              {/* sobre CARRO */}

              <div className={STYLES.sonOfTaskInfo}>
                <div className={STYLES.propertyInfo}>
                  <p className={STYLES.details}>Carro [NOME]:</p> 
                </div>

                <div className={STYLES.descriptionInfo}>
                  <span>{task.vehicleName.toUpperCase()}</span>
                </div>
              </div>

              {/* sobre ANO do carro */}

              <div className={STYLES.sonOfTaskInfo}>
                <div className={STYLES.propertyInfo}>
                  <p className={STYLES.details}>Carro [ANO]:</p>
                </div>

                <div className={STYLES.descriptionInfo}>
                  <span>{task.vehicleYear}</span>
                </div>
              </div>

              {/* sobre VALOR do carro */}

              <div className={STYLES.sonOfTaskInfo}>
                <div className={STYLES.propertyInfo}>
                  <p className={STYLES.details}>Carro [FIPE]:</p>
                </div>

                <div className={STYLES.descriptionInfo}>
                  <span>R$ {task.vehiclePrice}</span>
                </div>
              </div>

              {/* sobre DESCRIÇÃO */}

              {task.description && (
                <div className={STYLES.sonOfTaskInfo}>
                  <div className={STYLES.propertyInfo}>
                    <p className={STYLES.details}>Descrição:</p>
                  </div>
                  <div className={STYLES.descriptionInfo}>
                    <span>{task.description}</span>
                  </div>
                </div>
              )}
            </div>  

            {
              user.admin_mode && (
                <>
                  <div>
                    {
                      !task.status ? (
                        <form id={STYLES.formSection}>
                          <textarea 
                              id={STYLES.textarea} 
                              placeholder="Insira comentários sobre progressão da tarefa"
                              value={comment}
                              onChange={(e)=> {
                                  set_Comment(e.target.value)
                              }}
                          />
                        </form>
                      ) : (
                        <form id={STYLES.formSection}>
                          <textarea 
                              id={STYLES.textareaGhost} 
                              placeholder=""
                              disabled
                          />
                        </form>
                      )
                    }
                  </div>

                  < div id={STYLES.buttons}>
                    {
                      task.status ? (
                        <>
                          <button id={STYLES.addCommentGhost} onClick={(event) => event.preventDefault()}>
                            
                          </button>

                          <button id={STYLES.finishedTask} onClick={async () => {
                            await onRequestFinishUnfinish(task)
                            onRequestUpdateTask()
                            }}>
                            Desfazer conclusão
                          </button>
                        </>
                      ) : (
                        <>
                          <button id={STYLES.addComment} onClick={async () => {
                            await onRequestAddComent(comment)
                            set_Comment('')
                            }}>
                            Adicionar comentário
                          </button>

                          <button id={STYLES.finishTask} onClick={async () => {
                            await onRequestFinishUnfinish(task)
                            onRequestUpdateTask()
                            }}>
                            Concluir tarefa
                          </button>
                        </>
                      )
                    }
                  </div>
                </>  
              )
            }          
          </section>

          <span id={STYLES.divisory}></span>
          
          <section id={STYLES.containerComment}>

              <div id={STYLES.titleInfo}>
                {comments.length == 0 ? (
                  <>
                    <hr />
                    <h4>Nenhum comentário encontrado</h4>
                    <hr />
                  </>
                ):(
                  <>
                    <hr />
                    <h4>Histórico de comentários</h4>
                    <hr />
                  </>
                )}
              </div>

              <div id={STYLES.CommentList}>
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
                    <div>
                        <p className={STYLES.comment}>
                          <span>{dateTime}: </span> {comment.text}
                        </p>

                        {!task.status && user.admin_mode && (
                          <button className={STYLES.deleteCommentButton} onClick={(event) => {
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
          </section>
        </main>       
      </div>

    </Modal>
  )
}
