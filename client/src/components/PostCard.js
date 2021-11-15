import React from 'react'
import { Card } from 'react-bootstrap'

import Avatar from './Avatar'
import { Link, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment';
import { GLOBAL_TYPES } from '../redux/actions/global.types'
import { DeletePost } from '../redux/actions/post.action'
import { BASE_URL } from '../redux/utilities/config'

const PostCard = ({post, theme}) => {
    return (
        <Card>
            <Card.Header></Card.Header>
            <Card.Img />
            <Card.Body>
                <Card.Text></Card.Text>
            </Card.Body>
            <Card.Footer></Card.Footer>
        </Card>
    )
}

export default PostCard
