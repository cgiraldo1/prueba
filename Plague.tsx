import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Col, Row } from 'antd';
import { v4 as uuid } from 'uuid';
import { IDataQuarterly } from '../../../../config/Interfaces/Traceability/Ornamental';
import { Title } from '../../../Shared';
import PlagueForm from './PlagueForm';
import PlagueList from './PlagueList';

interface IPlague {
  readonly: boolean,
  data: IDataQuarterly,
  meta: any,
  handleMeta: (param: any) => void,
  getPestsByGroup: (value: string) => any,
}

const Plague: FC<IPlague> = ({
  readonly, data, meta, handleMeta, getPestsByGroup
}) => {
  const { t } = useTranslation();
  const [currentMeta, setCurrentMeta] = useState<any>({ visible: false, row: {} });

  const { plagues = [], species = [] } = meta || {};

  const handleCurrentMeta = (param: any) => setCurrentMeta((_currentMeta: any) => ({ ..._currentMeta, ...param }));

  const handleCreate = (values: any) => {
    const newValues = { ...values, id: uuid() };
    const input = plagues.length > 0 ? [...plagues].concat([newValues]) : [newValues];
    handleMeta({ plagues: input });
  };

  const handleDelete = (idDelete: string) => {
    const input = [...plagues].filter(({ id: row }) => row !== idDelete);
    handleMeta({ plagues: input });
  };

  const handleEdit = ({ id: idEdit, ...rest }: any) => {
    const input = [...plagues];
    const index = input.indexOf(input.find(({ id: row }) => row === idEdit));
    input[index] = { id: idEdit, ...rest };
    handleMeta({ plagues: input });
  };

  const handleForm = (row: any) => {
    handleCurrentMeta({ row, visible: true });
  };

  const handleSubmit = (values: any) => {
    if (!readonly) {
      if (currentMeta.row?.id) {
        handleEdit({ ...values, id: currentMeta.row.id });
      } else {
        handleCreate(values);
      }
    }
    handleCurrentMeta({ row: {}, visible: false });
  };

  return (
    <div>
      <Title title={t('quarterlyReports.plague.title')} />
      {!readonly && (
        <Row justify="end" style={{ marginBottom: 5, marginTop: 10 }}>
          <Col span={4}>
            <Button
              disabled={readonly || species.length === 0}
              type="primary"
              className="custom-full-width"
              onClick={() => {
                handleForm({});
              }}
            >
              {t('quarterlyReports.plague.add')}
            </Button>
          </Col>
        </Row>
      )}
      <PlagueForm
        visible={currentMeta.visible}
        handleCancel={() => handleCurrentMeta({ visible: false })}
        plaque={currentMeta.row}
        handleSubmit={handleSubmit}
        readonly={readonly}
        data={{ ...data, species }}
        getPestsByGroup={getPestsByGroup}
      />
      <PlagueList
        readonly={readonly}
        handleDelete={handleDelete}
        plagues={plagues}
        handleEdit={handleForm}
      />
    </div>
  );
};

export default Plague;
