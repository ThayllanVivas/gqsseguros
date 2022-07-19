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

  useEffect(() => {
    function toGetTaskResponsable(){
      const userFilter = users.find((user) => user.id == task.user_id)
      console.log('userFilter: ', userFilter)
      set_taskResponsable(userFilter)
    }

    toGetTaskResponsable()
  }, [users])

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

      <div className={STYLES.container}>
        <div className={STYLES.header}>
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

        {
          user.admin_mode && (
            <div id={STYLES.taskResponsable}>
                <p>Responsável: {taskResponsable?.name.toLocaleUpperCase()}</p> 
            </div>
          )
        }

        <section className={STYLES.containerItem}>          
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

          <hr />

          <div id={STYLES.taskCommentsContainer}>
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
                      <p className={STYLES.commentsContainer}>
                        <span>{dateTime}: </span> {comment.text}
                      </p>
                      {task.status && user.admin_mode && (
                        <>
                        </>
                      )}
                      {task.status && !user.admin_mode && (
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

            <hr />
            
        </section>


        {
          !user.admin_mode && (
            <div>
              {
                !task.status && (
                  <form id={STYLES.formSection}>
                    <textarea 
                        className={STYLES.textarea} 
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
            <div className={STYLES.buttons}>
              {
                task.status ? (
                  <button id={STYLES.addCommentGhost} onClick={(event) => event.preventDefault()}>
                    
                  </button>
                ) : (
                  <button id={STYLES.addComment} onClick={async () => {
                    await onRequestAddComent(comment)
                    set_Comment('')
                    }}>
                    Adicionar comentário
                  </button>
                )
              }

              {
                task.status ? (
                  <button id={STYLES.finishedTask} onClick={async () => {
                    await onRequestFinishUnfinish(task)
                    await onRequestUpdateTask()
                    }}>
                    Desfazer conclusão
                  </button>
                ) : (
                  <button id={STYLES.finishTask} onClick={async () => {
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
