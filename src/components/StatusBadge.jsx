function StatusBadge({
status
}){


const colors={

Confirmed:
"bg-green-100 text-green-700",

Pending:
"bg-yellow-100 text-yellow-700",

Cancelled:
"bg-red-100 text-red-700"

};


return (

<span
className={`
rounded-full px-3 py-1 text-sm
${colors[status]}
`}
>

{status}

</span>

);

}


export default StatusBadge;