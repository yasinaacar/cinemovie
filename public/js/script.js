function searchActor(){
  
    const searchInput = document.querySelector("#searchForActors");
    
    searchInput.addEventListener("keyup",function(){
      
      let data = this.value;
      console.log(data)
      let checkbox = document.querySelectorAll(".form-check-label");
      console.log(checkbox)
      
      for( let i = 0; i < checkbox.length; i++) {
        console.log(checkbox[i].innerHTML);
        if(checkbox[i].innerHTML.indexOf(data) > -1){
          // eşleşme var
          checkbox[i].style.display = "";
        } else {
          // eşleşme yok
          checkbox[i].style.display = "none";
        }
      }
      
    });
    
  }


  
  searchActor();