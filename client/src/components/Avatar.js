import React from 'react'
import { useSelector } from 'react-redux'

const Avatar = ({ src, classes }) => {
    const { theme } = useSelector(state => state)
    return (
        <img src={src} alt="avatar" className={classes} style={{ filter: `${ theme ? 'invert(1)' : 'invert(0)'}`}} />
    )
}

export default Avatar
