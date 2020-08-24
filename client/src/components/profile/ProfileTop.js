import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FaGlobe, FaTwitter, FaFacebookF, FaYoutube, FaLinkedin, FaInstagram } from "react-icons/fa";

const ProfileTop = ({
        profile: {
            status,
            company,
            location,
            website,
            social,
            user: { name, avatar }
        }
    }) => {
        return (
            <Fragment>
                <div className="profile-top bg-primary p-2">
                    <img className="round-img my-1" src={avatar} alt="" />
                    <h1 className="large">{name}</h1>
                    <p className="lead">
                        {status} {company && <span>at {company}</span>}
                    </p>
                    <p>{location && <span>{location}</span>}</p>
                    <div className="icons my-1">
                        {website && (
                            <a href={website} target="_blank" rel="noopener noreferrer">
                                <FaGlobe />
                            </a>
                        )}
                        {social && social.twitter && (
                            <a href={social.twitter} target="_blank" rel="noopener noreferrer">
                                <FaTwitter />
                            </a>
                        )}
                        {social && social.facebook && (
                            <a href={social.facebook} target="_blank" rel="noopener noreferrer">
                                <FaFacebookF />
                            </a>
                        )}
                        {social && social.linkedin && (
                            <a href={social.linkedin} target="_blank" rel="noopener noreferrer">
                                <FaLinkedin />
                            </a>
                        )}
                        {social && social.youtube && (
                            <a href={social.youtube} target="_blank" rel="noopener noreferrer">
                                <FaYoutube />
                            </a>
                        )}
                        {social && social.instagram && (
                            <a
                            href={social.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            >
                                <FaInstagram />
                            </a>
                        )}
                    </div>
                </div>
            </Fragment>
        );
};

ProfileTop.propTypes = ({
    profile: PropTypes.object.isRequired
});

export default ProfileTop;

