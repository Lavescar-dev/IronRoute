import React from 'react';
import { Box, Typography, Chip, Paper } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import {
  Opacity as OilIcon,
  TireRepair as TireIcon,
  Warning as BrakeIcon,
  Verified as InspectionIcon,
  Build as RepairIcon,
  EventNote as ScheduledIcon,
  MoreHoriz as OtherIcon,
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/helpers';

const TYPE_CONFIG = {
  OIL: { icon: <OilIcon />, color: '#FF8F00', label: 'Yag Degisimi' },
  TIRE: { icon: <TireIcon />, color: '#616161', label: 'Lastik Degisimi' },
  BRAKE: { icon: <BrakeIcon />, color: '#D32F2F', label: 'Fren Bakimi' },
  INSPECTION: { icon: <InspectionIcon />, color: '#1976D2', label: 'Muayene' },
  REPAIR: { icon: <RepairIcon />, color: '#E65100', label: 'Ariza/Tamir' },
  SCHEDULED: { icon: <ScheduledIcon />, color: '#7B1FA2', label: 'Planli Bakim' },
  OTHER: { icon: <OtherIcon />, color: '#455A64', label: 'Diger' },
};

const STATUS_CONFIG = {
  COMPLETED: { color: 'success', label: 'Tamamlandi' },
  IN_PROGRESS: { color: 'info', label: 'Devam Ediyor' },
  SCHEDULED: { color: 'warning', label: 'Planlandi' },
  CANCELLED: { color: 'default', label: 'Iptal' },
};

const MaintenanceTimeline = ({ records }) => {
  const sorted = [...records].sort(
    (a, b) =>
      new Date(b.scheduled_date || b.created_at) -
      new Date(a.scheduled_date || a.created_at)
  );

  return (
    <Timeline position="right" sx={{ p: 0, m: 0 }}>
      {sorted.map((record, index) => {
        const typeConf = TYPE_CONFIG[record.maintenance_type] || TYPE_CONFIG.OTHER;
        const statusConf = STATUS_CONFIG[record.status] || STATUS_CONFIG.SCHEDULED;
        const date = record.completed_date || record.scheduled_date;

        return (
          <TimelineItem key={record.id}>
            <TimelineOppositeContent
              sx={{ flex: 0.25, minWidth: 100, pt: 2 }}
            >
              <Typography variant="caption" color="text.secondary">
                {date
                  ? new Date(date).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '-'}
              </Typography>
              {record.odometer_reading && (
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                >
                  {record.odometer_reading.toLocaleString('tr-TR')} km
                </Typography>
              )}
            </TimelineOppositeContent>

            <TimelineSeparator>
              <TimelineDot
                sx={{
                  bgcolor: typeConf.color,
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {typeConf.icon}
              </TimelineDot>
              {index < sorted.length - 1 && <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent sx={{ pb: 3 }}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                    flexWrap: 'wrap',
                  }}
                >
                  <Chip
                    label={typeConf.label}
                    size="small"
                    sx={{ bgcolor: typeConf.color, color: '#fff' }}
                  />
                  <Chip
                    label={statusConf.label}
                    size="small"
                    color={statusConf.color}
                    variant="outlined"
                  />
                </Box>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  {record.description}
                </Typography>

                {record.parts_replaced && record.parts_replaced.length > 0 && (
                  <Box sx={{ mb: 1 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      Degisen Parcalar:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {record.parts_replaced.map((part, i) => (
                        <Chip key={i} label={part} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {record.service_provider}
                    </Typography>
                    {record.service_address && (
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        {record.service_address}
                      </Typography>
                    )}
                    {record.technician_name && (
                      <Typography
                        variant="caption"
                        display="block"
                        color="text.secondary"
                      >
                        Teknisyen: {record.technician_name}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="body2" fontWeight={700} color="primary">
                    {formatCurrency(parseFloat(record.cost) || 0)}
                  </Typography>
                </Box>

                {record.notes && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      mt: 1,
                      display: 'block',
                      fontStyle: 'italic',
                    }}
                  >
                    Not: {record.notes}
                  </Typography>
                )}
              </Paper>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};

export default MaintenanceTimeline;
