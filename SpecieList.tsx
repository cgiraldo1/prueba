import React, { FC } from 'react';
import {
  DeleteOutlined, EditOutlined, EyeOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Table, ActionButton } from '../../../Shared';

interface ISpecieList {
  readonly: boolean,
  handleDelete(id: string): void,
  handleEdit?: Function,
  species: any,
}

interface IRecord {
  record: any,
}

const SpecieList: FC<ISpecieList> = ({
  handleDelete, handleEdit, species, readonly
}) => {
  const { t } = useTranslation();
  const columns = {
    scientificName: t('quarterlyReports.specie.scientificName'),
    commonName: t('quarterlyReports.specie.commonName'),
    totalArea: t('quarterlyReports.sownArea.total'),
  };

  const renders = [
    {
      key: 'totalArea',
      render: (_: any, { sownArea }: any) => sownArea?.totalArea
    },
  ];

  return (
    <Table
      rowKey="id"
      data={species}
      titles={columns}
      renders={renders}
      widthActions={140}
      actions={
      [
        ({ record }: IRecord) => (!readonly && (
          <ActionButton
            key="edit"
            type="primary"
            icon={<EditOutlined />}
            text={t('quarterlyReports.specie.edit')}
            handleClick={() => handleEdit?.(record)}
          />
        )),
        ({ record }: IRecord) => (!readonly && (
          <ActionButton
            key="delete"
            confirm
            handleClick={() => handleDelete(record.id)}
            confirmText={t('quarterlyReports.specie.confirmDelete')}
            danger
            icon={<DeleteOutlined />}
            text={t('quarterlyReports.specie.delete')}
          />
        )),
        ({ record }: IRecord) => (readonly && (
          <ActionButton
            key="view"
            type="primary"
            icon={<EyeOutlined />}
            text={t('quarterlyReports.specie.view')}
            handleClick={() => handleEdit?.(record)}
          />
        )),
      ]
    }
    />
  );
};

export default SpecieList;
