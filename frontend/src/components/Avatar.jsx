function Avatar({
  image,
  name,
  size="md"
}) {


const sizes={
sm:"w-8 h-8",
md:"w-12 h-12",
lg:"w-20 h-20"
};


return (

<img
src={image}
alt={name}
className={`
rounded-full object-cover
${sizes[size]}
`}
/>

);

}

export default Avatar;