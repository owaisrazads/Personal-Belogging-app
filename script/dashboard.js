import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import { auth, db } from "./config.js";
import { collection, addDoc, Timestamp, getDocs, where, query, orderBy, deleteDoc, updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";



const profileImage = document.querySelector('#profileImage');
const username = document.querySelector('#username');
const allBlogs = document.querySelector('#allBlogs');
const profile = document.querySelector('#profile');
const logout = document.querySelector('#logout');
const blogform = document.querySelector('#todoForm');
const card = document.querySelector('#blogcontainer');
const title = document.querySelector('#title');
const description = document.querySelector('#description');
const personalBlog = document.querySelector('#personalBlog')

personalBlog.addEventListener('click' , ()=>{
    window.location = "index.html"
})

allBlogs.addEventListener('click' , ()=>{
    window.location = "index.html"
});
profile.addEventListener('click' , ()=>{
    window.location = "profile.html"
});




let uid;

let userData;
const q = query(collection(db, "users"),);
const querySnapshot = await getDocs(q);


querySnapshot.forEach((doc) => {
    userData = doc.data()


});

let mainData;
let fullName;
let userEmail;

onAuthStateChanged(auth, async (user) => {
    if (user) {
         uid = user.uid;
         userEmail = user
        //  console.log(user.email);
        const q = query(collection(db, "user"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // console.log(doc.data());
            fullName = `${doc.data().firstName} ${doc.data().lastName}`
            username.innerHTML = fullName
            mainData = doc.data()
            profileImage.src = doc.data().profileUrl
        });
        blogform.addEventListener('submit', async (event) => {
            event.preventDefault();
        
        
            try {
                const postObj = {
                    title: title.value,
                    description: description.value,
                    uid: auth.currentUser.uid,
                    postDate: Timestamp.fromDate(new Date()),
                    userimg: mainData.profileUrl,
                    name: fullName,
                    time: Timestamp.fromDate(new Date()),
                    email: user.email
                }
                const docRef = await addDoc(collection(db, "posts"), postObj);
                console.log("Document written with ID: ", docRef.id);
                postObj.docId = docRef.id;
                arr = [postObj, ...arr];
                console.log(arr);
                // console.log(user.email);
                renderPost();
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        });
        getDataFromFirestore(uid)
    } else {
        window.location = 'index.html'
    }
});



logout.addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('logout successfully');

    }).catch((error) => {
        console.log(error);
    });
})



let arr = [];

function renderPost() {
    card.innerHTML = ''
    arr.map((item) => {

        const time = item.time.seconds
        const mydate = new Date(time * 1000)
        const stringdate = mydate.toLocaleString()
        const parts = stringdate.split('/')
        const month = parseInt(parts[0], 10);
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        // Create a Date object
        const myDate = new Date(year, month - 1, day);
        // Format the date as "Dec 2nd, 2023"
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const formattedDate = myDate.toLocaleDateString('en-US', options);

        // console.log(item.arr);
        card.innerHTML += `
        <div class="flex justify-center ">
        <div class=" bg-white w-[70%] mr-[10%] form-border pb-4 pt-5 pl-5 pr-5 mb-5  max-[1400px]:w-[40%] max-[800px]:w-[50%] max-[600px]:w-[70%] max-[1000px]:w-[50%]">

            <div class="flex items-center mb-5">
                <img src="${item.userimg}" class="rounded-xl mr-5 cursor-pointer blog-img" alt="">
                <div class="">
                    <p class="text-black text-2xl font-semibold mb-2">${item.title}</p>
                    <p class="font-bold text-[#343a40a9]">${item.name} - ${formattedDate}</p>
                </div>
            </div>

            <div class="mb-5">
                <p class="text-lg text-[#343a40a9] font-[500]">${item.description}</p>
            </div>

            <div class="text-[#7749f8] text-lg font-[500]">
                <button id="delete">Delete</button>&nbsp;&nbsp;&nbsp;
                <button id="update">Edit</button>
            </div>

        </div>
    </div>`
    // console.log(item);

    title.value = ""
    description.value = ""
    })

    const del = document.querySelectorAll('#delete');
    const upd = document.querySelectorAll('#update');

    del.forEach((btn, index) => {
        btn.addEventListener('click', async () => {
            // console.log('delete called', arr[index]);
            await deleteDoc(doc(db, "posts", arr[index].docId))
                .then(() => {
                    console.log('post deleted');
                    arr.splice(index, 1);
                    renderPost()
                });
        })
    })
    upd.forEach((btn, index) => {
        btn.addEventListener('click', async () => {
            console.log('update called', arr[index]);
            const updatedTitle = prompt( 'enter new Title' , arr[index].title);
            const updatedDes = prompt( 'enter new Description' , arr[index].description);
            await updateDoc(doc(db, "posts", arr[index].docId), {
                title: updatedTitle,
                description: updatedDes,
                time: Timestamp.fromDate(new Date()),
            });
            arr[index].title = updatedTitle;
            arr[index].description = updatedDes;

            renderPost()

        })
    })
}


async function getDataFromFirestore(uid) {
    arr.length = 0;
      const q = await query(collection(db, "posts"), orderBy("time", "desc"), where("uid", "==", uid));
    // const userUid = await auth.currentUser
    // console.log(uid);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // console.log(doc.data());
        arr.push({ ...doc.data(), docId: doc.id });
    });
    // console.log(arr);
    renderPost();
}





// console.log(profileUrl);
console.log(userEmail);