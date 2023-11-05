let element=(id)=> document.getElementById(id);

let error_name = "Username must be at least 3 characters long";
let error_email = "Email must be of form 'johndoe@email.com'";
let error_terms = "Agree to terms and conditions";
let error_dob = "Age must be between 18 and 55 years";
let empty="This is a required field";

let entry=[];

let uname=element("name"),
    email=element("email"),
    password=element("password"),
    dob=element("dob"),
    terms=element("terms"),
    form=element("form");

function fillTable(){
    let obj = localStorage.getItem("entry");
    if(obj){
        entry = JSON.parse(obj);
    }else{
        entry = [];
    }
    return entry;
}
entry = fillTable();
    
function error(elem,message,cnd){
    if(!cnd){
        elem.style.border = "3px solid red";
        elem.setCustomValidity(message);
        elem.reportValidity();
    }else{
        elem.style.border = "";
        elem.setCustomValidity('');
    }
}

uname.addEventListener("input",(msg)=>{
    let x=uname.value.length>=3;
    msg.preventDefault();
    error(uname,error_name,x);
});

email.addEventListener("input",(msg)=>{
    let x=email.value.includes("@")&&email.value.includes(".");
    msg.preventDefault();
    error(email,error_email,x);
});

dob.addEventListener("input",(msg)=>{
    let age=Number(new Date().getFullYear())-Number(new Date(dob.value).getFullYear());
    let x=((age>=18)&&(age<=55));
    msg.preventDefault();
    error(dob,error_dob,x);
});

function makeObject(){
    let check = false;
    if(terms.checked){
        check = true;
    }
    let obj = {
        name: uname.value,
        email: email.value,
        password: password.value,
        dob: dob.value,
        checked: check
    }
    return obj;
}

function displayTable(){
    let table = element("entry-table");
    let entries = entry;
    let str = `<caption><b>Entries</b></caption>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Password</th>
                    <th>Dob</th>
                    <th>Accepted terms?</th>
                </tr>\n`;
    for(let i=0;i<entries.length;i++){
        str += `<tr>
                    <td>${entries[i].name}</td>
                    <td>${entries[i].email}</td>
                    <td>${entries[i].password}</td>
                    <td>${entries[i].dob}</td>
                    <td>${entries[i].checked}</td>
                </tr>\n`;
    }
    table.innerHTML = str;
}

form.addEventListener("submit", (msg) => {
    let x=!terms.checked;
    msg.preventDefault();
    if (!x) {
        let obj = makeObject();
        entry.push(obj);
        localStorage.setItem("entry", JSON.stringify(entry));
    }
    displayTable();
});

window.onload = (event) => {
    displayTable();
};