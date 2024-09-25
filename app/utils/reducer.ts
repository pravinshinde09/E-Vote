import { ActionTypes } from '../components/action';
import {
    SET_FIELD,
    RESET_STATE
} from '../components/action';

export type FileObject = {
    name: string;
    url: string;
};

export type State = {
    title: string;
    details: string,
    imageUrl: string;
    imageId: string;
    timestamp: any;
    isUploading: boolean;
    isApproved: boolean;
    referencePostId: string;
    name: string;
    email: string;
    phoneNumber: string,
    bio: string,
    postAssets: string[];
    organizationId: string
}

const initialState: State = {
    title: '',
    details: '',
    imageUrl: '',
    imageId: '',
    isUploading: false,
    isApproved: false,
    referencePostId: '',
    timestamp: '',
    name: '',
    email: '',
    phoneNumber: '',
    bio: '',
    postAssets: [],
    organizationId: '',
};

const reducer = (state: State, action: ActionTypes): State => {
    switch (action.type) {
        case SET_FIELD:
            return { ...state, ...action.payload };
        case RESET_STATE:
            return initialState;
        default:
            return state;
    }
};

export { initialState, reducer };