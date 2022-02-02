import ui from './ui.module.css'

const FullTask = ({setOpenModal, fullTask}) => {


    return (
        <div className={ui.content} onClick={() => setOpenModal(false)}>
            <div className={ui.modal} onClick={e => e.stopPropagation()}>
                <p className={ui.status}>Status: {fullTask.status}</p>
                <h1 className={ui.title}>{fullTask.title}</h1>
                <div>
                    <h3 className={ui.description}>{fullTask.description}</h3>
                    <p className={ui.descriptionText}>{fullTask.fullDescription}</p>
                </div>
            </div>
        </div>
    )
}

export default FullTask
