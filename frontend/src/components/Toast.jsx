function Toast({
message,
type="success"
}){


const colors={

success:
"bg-green-600",

error:
"bg-red-600"

};


return(

<div
className={`
fixed bottom-5 right-5
rounded-lg px-5 py-3
text-white
${colors[type]}
`}
>

{message}

</div>

)

}


export default Toast;