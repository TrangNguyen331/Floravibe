import React from 'react'
import { Card, CardBody } from '@windmill/react-ui'
import classNames from 'classnames';

function InfoCard({ title, value, onClick, disableHover, children: icon }) {
  const cardClass = classNames({
    'hover:bg-gray-200 dark:hover:bg-gray-400 transition ease-in-out duration-200 cursor-pointer': !disableHover
  });
  return (
    <Card onClick={onClick} className={cardClass}>
      <CardBody className="flex items-center">
        {icon}
        <div>
          <p className="mb-2 text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">{value}</p>
        </div>
      </CardBody>
    </Card>
  )
}

export default InfoCard
