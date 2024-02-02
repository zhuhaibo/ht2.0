import { useModel } from "umi";
export default function () {
    const { initialState } = useModel("@@initialState");

    return initialState.clientId;
}
