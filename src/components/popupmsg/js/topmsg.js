
export const TopPopUpMsg = (Seconds, Msg) => {
    // popup msg in 4s
    document.getElementsByClassName("msgContainer")[0].style.display = "block"
    document.getElementById("msgvalue").innerHTML = Msg
    setInterval(()=>{
      document.getElementsByClassName("msgContainer")[0].style.display = "none"
      document.getElementById("msgvalue").innerHTML = ""
    }, (Seconds * 1000));
}