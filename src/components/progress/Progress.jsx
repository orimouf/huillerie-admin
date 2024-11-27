import "./progress.scss"

const widget = (props) => {

    let classBar = `progress-bar w-${props.progress}`
    console.log(props.progress);
  return (
    <div id={"file-" + props.id} className="progress-container" style={{display: "none"}}>
        <div className="progress">
            <div className={classBar} role="progressbar" aria-valuenow={props.progress} aria-valuemin="0" aria-valuemax="100"></div>
        </div>
    </div>
  )
}

export default widget
