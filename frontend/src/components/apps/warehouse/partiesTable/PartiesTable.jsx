import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import PartyStore from "../../../../PartyStore";

const PartiesTable = observer(() => {
    const { parties, getParties } = PartyStore

    useEffect(() => [
        getParties()
    ], [parties])
})

export default PartiesTable;