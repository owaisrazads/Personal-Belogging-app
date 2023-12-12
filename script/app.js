import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, getDocs, query, where,orderBy } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";


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


profile.addEventListener('click' , ()=>{
    window.location = "profile.html"
})
dashboard.addEventListener('click' , ()=>{
    window.location = "dashboard.html"
})


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
            return
        });
        // getDataFromFirestore(user.uid)
    } else {
        loginBtn.style.display = "block"
        profileDiv.style.display = 'none'
    }
    
    
});


let greeting;
if (currentHour >= 5 && currentHour < 12) {
    greeting = 'Good Morning'
} else if (currentHour >= 12 && currentHour < 17) {
    greeting = 'Good Afternoon'
} else if (currentHour >= 17 && currentHour < 21) {
    greeting = 'Good Evening';
} else {
    greeting = 'Good Night';
}
// console.log(greeting);
const text = document.createTextNode(`${greeting} Readers!`)
timeOfReader.appendChild(text)




logout.addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('logout successfully');
        profileDiv.className = "hidden"
        loginBtn.className = "block"

    }).catch((error) => {
        console.log(error);
    });
})



const allArry = [];



const postsQuerySnapshot = await getDocs(collection(db, "posts"),orderBy("time", "desc"), where('uid', '==', uid));
postsQuerySnapshot.forEach((doc) => {
    allArry.push({ ...doc.data(), docId: doc.id });
});
console.log(allArry);

allArry.map(async (item) => {
    // console.log(item);
    // const time = item.time.seconds
    // const mydate = new Date(time * 1000)
    // const stringdate = mydate.toLocaleString()
    // const parts = stringdate.split('/')
    // const month = parseInt(parts[0], 10);
    // const day = parseInt(parts[1], 10);
    // const year = parseInt(parts[2], 10);
    // // Create a Date object
    // const myDate = new Date(year, month - 1, day);
    // // Format the date as "Dec 2nd, 2023"
    // const options = { month: 'short', day: 'numeric', year: 'numeric' };
    // const formattedDate = myDate.toLocaleDateString('en-US', options);
//    console.log(item);
    allBlogsDiv.innerHTML += `
    
    <div class="flex justify-center ">
        <div class=" bg-white w-[70%] mr-[10%] form-border pb-4 pt-5 pl-5 pr-5 mb-5 ">

            <div class="flex items-center mb-5">
                <img src="${item.userimg}" class="rounded-xl mr-5 cursor-pointer blog-img" alt="">
                <div class="">
                    <p class="text-black text-2xl font-semibold mb-2">${item.title}</p>
                    <p class="font-bold text-[#343a40a9]">${item.name} - ${formattedDate(item.postDate)}</p>
                </div>
            </div>

            <div class="mb-5">
                <p class="text-lg text-[#343a40a9] font-[500] ">${item.description}</p>
            </div>

            <div class="text-[#7749f8] text-lg font-[500]">
                <button id= "seeAll">see all from this user</button>
            </div>

        </div>
    </div> 
    `

    const seeAll = document.querySelectorAll("#seeAll");

    seeAll.forEach((item, index) => {
      item.addEventListener("click", () => {
        console.log("btn clicked at index", index);
        let detailsArr = [];
        const obj = {
          uid: allArry[index].uid,
        //   firstName: allArry[index].firstName,
        //   lastName: allArry[index].lastName,
        //   email: allArry[index].email,
        //   profileUrl: allArry[index].profileUrl,
        };
        // console.log(allArry[index].profileUrl);
        detailsArr.push(obj);
  
        console.log(allArry[index]);
        const seeAlluid = JSON.stringify(detailsArr);
        localStorage.setItem("userDetails", seeAlluid);
        window.location = "seeUser.html";
      });
    });
})


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


