import React, { FC } from 'react';
import {
  DeleteOutlined, EditOutlined, EyeOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Table, ActionButton } from '../../../Shared';

interface IPlagueList {
  readonly: boolean,
  handleDelete(id: string): void,
  handleEdit?: Function,
  plagues: any,
}

interface IRecord {
  record: any,
}

const PlagueList: FC<IPlagueList> = ({
  handleDelete, handleEdit, plagues, readonly
}) => {
  const { t } = useTranslation();
  const columns = {
    specie: t('quarterlyReports.plague.form.specieList'),
    group: t('quarterlyReports.plague.form.group'),
    type: t('quarterlyReports.plague.form.type'),
    order: t('quarterlyReports.plague.form.order'),
    incidence: t('quarterlyReports.plague.form.incidence'),
    scaleGrade: t('quarterlyReports.plague.form.scaleDegree'),
  };

  const renders = [
    {
      key: 'specie',
      render: (_: any, { specie }: any) => specie?.scientificName?.name
    },
    {
      key: 'group',
      render: (_: any, { pest }: any) => pest?.groupPest?.name || 'Otro'
    },
    {
      key: 'type',
      render: (_: any, { pest }: any) => pest?.name || 'N/A'
    },
    {
      key: 'order',
      render: (_: any, { pest }: any) => pest?.order || 'N/A'
    },
  ];

  return (
    <Table
      rowKey="id"
      data={plagues}
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
            text={t('quarterlyReports.plague.edit')}
            handleClick={() => handleEdit?.(record)}
          />
        )),
        ({ record }: IRecord) => (!readonly && (
          <ActionButton
            key="delete"
            confirm
            handleClick={() => handleDelete(record.id)}
            confirmText={t('quarterlyReports.plague.confirmDelete')}
            danger
            icon={<DeleteOutlined />}
            text={t('quarterlyReports.plague.delete')}
          />
        )),
        ({ record }: IRecord) => (readonly && (
          <ActionButton
            key="view"
            type="primary"
            icon={<EyeOutlined />}
            text={t('quarterlyReports.plague.view')}
            handleClick={() => handleEdit?.(record)}
          />
        )),
      ]
    }
    />
  );
};

export default PlagueList;
