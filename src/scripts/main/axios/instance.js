import axios from "axios"

export default function createInstance() {
    return axios.create({
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "X-Requested-With": "XMLHttpRequest"
        },
    });
}

