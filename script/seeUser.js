import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, getDocs, query,orderBy, where } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";


// profileDiv.className = "hidden"

const loginBtn = document.querySelector('#loginBtn')
const profileDiv = document.querySelector('#profileDiv')
const logout = document.querySelector('#logout')
const profileImage = document.querySelector('#profileImage');
const username = document.querySelector('#username');
const profile = document.querySelector('#profile');
const dashboard = document.querySelector('#dashboard');
const currentTime = new Date();
const currentHour = currentTime.getHours();
const timeOfReader = document.querySelector('#time');
const allBlogsDiv = document.querySelector('#allBlogsDiv')
const backToAll = document.querySelector('#backToAll')
const allFrom = document.querySelector('#allFrom')
const seeEmail = document.querySelector('#seeEmail')
const seeName = document.querySelector('#seeName')
const seeImg = document.querySelector('#seeImg')
const personalBlog = document.querySelector('#personalBlog')

personalBlog.addEventListener('click' , ()=>{
    window.location = "index.html"
})


profile.addEventListener('click' , ()=>{
    window.location = "profile.html"
});
dashboard.addEventListener('click' , ()=>{
    window.location = "dashboard.html"
});
backToAll.addEventListener('click' , ()=>{
    window.location = "index.html"
});


loginBtn.style.display = "none"


let uid;
onAuthStateChanged(auth, async(user) => {
    if (user) {
      
        uid = user.uid;
        const q = query(collection(db, "user"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        // console.log(querySnapshot);
        querySnapshot.forEach((doc) => {
            console.log(doc.data());
            let fullName = `${doc.data().firstName} ${ doc.data().lastName}`
            // console.log(fullName);
            username.innerHTML = fullName
            profileImage.src = doc.data().profileUrl
            render()
            return
        });
        // getDataFromFirestore(user.uid)
    } else {
        loginBtn.style.display = "block"
        profileDiv.style.display = 'none'
        render()
    }
    
    
});

logout.addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('logout successfully');
        profileDiv.className = "hidden"
        loginBtn.className = "block"

    }).catch((error) => {
        console.log(error);
    });
})


// const data = localStorage.getItem('userDetails');
// const items = JSON.parse(data);
// let localUid = items[0].uid
// console.log(localUid);





let arr = [];

async function render() {
    allBlogsDiv.innerHTML = ""
  const data = localStorage.getItem("userDetails");
  const userDetails = JSON.parse(data);

  const userUid = userDetails[0].uid;
  const q = query(
    collection(db, "posts"),
    orderBy("time", "desc"),
    where("uid", "==", userUid)
  );
  const querySnapshot = await getDocs(q);
//   div.innerHTML = "";
  arr = [];
  querySnapshot.forEach((doc) => {
    arr.push({ ...doc.data(), docId: doc.id });
  });
  console.log(arr);
  allFrom.innerHTML = `All from ${arr[0].name}`;
  arr.forEach((item, index) => {
    seeEmail.innerHTML = item.email
    seeImg.src = item.userimg
    seeName.innerHTML = item.name
    
    allBlogsDiv.innerHTML += `
    <div class="flex justify-center ">
                <div class=" bg-white mainBlog form-border pb-4 pt-5 pl-5 pr-5 mb-5  max-[1400px]:w-[40%] max-[800px]:w-[50%] max-[600px]:w-[70%] max-[1000px]:w-[50%]">
        
                    <div class="flex items-center mb-5">
                        <img src="${item.userimg}" height="80px" width="80px" class="rounded-xl mr-5 cursor-pointer blog-img" alt="">
                        <div class="">
                            <p class="text-black text-2xl font-semibold mb-2">${item.title}</p>
                            <p class="font-bold text-[#343a40a9]">${item.name} - ${formattedDate(item.postDate)}</p>
                        </div>
                    </div>
        
                    <div class="mb-5">
                        <p class="text-lg text-[#343a40a9] font-[500] main-pera">${item.description}</p>
                    </div>
        
                </div>
            </div> 
  `;
  });
}

function formattedDate(timestamp) {
    const dateObject = timestamp.toDate();
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return dateObject.toLocaleDateString("en-US", options);
  }

