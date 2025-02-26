import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DeleteOutlined, EditOutlined, EyeOutlined, DownloadOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { Tag } from 'antd';
import { ActionButton, Table } from '../../../Shared';
import { dateVisualization } from '../../../../config/Shared/Constants/dateFormat';

let columns: any = {
  year: 'quarterlyReports.columns.year',
  quarter: 'quarterlyReports.columns.quarterly',
  unit: 'quarterlyReports.columns.unit',
  specie: 'quarterlyReports.columns.specie',
  createdAt: 'quarterlyReports.columns.createdAt',
};

const QuarterlyReportList = ({
  royaReports, handleDelete, handleEdit, handleView, pagination, handleTable, handlePdf, isAgent
}: any) => {
  const { t } = useTranslation();
  if (isAgent()) {
    columns = {
      company: 'quarterlyReports.columns.company',
      ...columns,
      statusCommentAgent: 'quarterlyReports.columns.status'
    };
  }
  const renders = [
    {
      key: 'unit',
      render: (_: any, { plant }: any) => plant?.name
    },
    {
      key: 'specie',
      render: (_: any, { species = [] }: any) => species.map(({ scientificName }: any, index: number) => <Tag color="blue" key={index}>{scientificName}</Tag>)
    },
    {
      key: 'createdAt',
      render: (_: any, { createdAt }: any) => (createdAt ? moment(createdAt).format(dateVisualization) : '')
    },
    {
      key: 'company',
      render: (_: any, { company }: any) => company?.name || ''
    },
  ];

  return (
    <Table
      rowKey="id"
      widthActions={190}
      data={royaReports}
      titles={columns}
      renders={renders}
      pagination={pagination}
      handleTable={handleTable}
      actions={
       [
         ({ record }: any) => (record.editeable && (
           <ActionButton
             key="edit"
             handleClick={() => handleEdit(record.id)}
             type="primary"
             icon={<EditOutlined />}
             text={t('quarterlyReports.columns.edit')}
           />
         )),
         ({ record }: any) => (
           <ActionButton
             key="view"
             handleClick={() => handleView(record.id)}
             type="primary"
             icon={<EyeOutlined />}
             text={t('quarterlyReports.columns.view')}
           />
         ),
         ({ record }: any) => (record.deleteable && (
           <ActionButton
             key="delete"
             confirm
             handleClick={() => handleDelete(record.id)}
             confirmText={t('quarterlyReports.columns.confirmDelete')}
             type="primary"
             danger
             icon={<DeleteOutlined />}
             text={t('quarterlyReports.columns.delete')}
           />
         )),
         ({ record }: any) => (
           <ActionButton
             key="pdf"
             handleClick={() => handlePdf(record.id)}
             type="primary"
             icon={<DownloadOutlined />}
             text={t('quarterlyReports.pdf')}
           />
         ),
       ]
    }
    />
  );
};
export default QuarterlyReportList;
