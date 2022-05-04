import React, { useState } from 'react'
import Button from '@mui/material/Button'
import { Card } from '@mui/material'
import { Form } from 'src/common/react-platform-components'
import { ButtonLoader, MuiTextField as TextField } from 'src/common/ui-kit'
import { useIntl } from 'src/common/react-platform-translation'

interface IEquipementForm {
    enableForm: () => void
    onSubmit: (data: any) => void
    isEdit: boolean
}

export const EquipmentForm = ({ enableForm, onSubmit, isEdit }: IEquipementForm) => {
    const { formatMessage } = useIntl()

    return (
        <div>EquipmentForm</div>
    )
}
