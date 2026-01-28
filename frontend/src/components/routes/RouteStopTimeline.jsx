import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import {
  FlagCircle as OriginIcon,
  LocationOn as StopIcon,
  WhereToVote as DestIcon,
  LocalCafe as RestIcon,
} from '@mui/icons-material';

const TRAFFIC_COLORS = {
  green: { bgcolor: '#2E7D32', label: 'Acik' },
  yellow: { bgcolor: '#ED6C02', label: 'Yogun' },
  red: { bgcolor: '#D32F2F', label: 'Cok Yogun' },
};

const STOP_ICONS = {
  ORIGIN: <OriginIcon />,
  DESTINATION: <DestIcon />,
  REST: <RestIcon />,
};

const RouteStopTimeline = ({ stops }) => {
  if (!stops || stops.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
        Durak bilgisi bulunamadi.
      </Typography>
    );
  }

  return (
    <Timeline position="right" sx={{ p: 0, m: 0 }}>
      {stops.map((stop, index) => {
        const traffic = TRAFFIC_COLORS[stop.traffic] || TRAFFIC_COLORS.green;
        const isFirst = index === 0;
        const isLast = index === stops.length - 1;

        return (
          <TimelineItem key={stop.id || index}>
            <TimelineOppositeContent sx={{ flex: 0.3, minWidth: 70, pt: 1.5 }}>
              {stop.estimated_arrival ? (
                <Typography variant="caption" color="text.secondary">
                  {new Date(stop.estimated_arrival).toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  {isFirst ? 'Baslangic' : '-'}
                </Typography>
              )}
            </TimelineOppositeContent>

            <TimelineSeparator>
              <TimelineDot
                sx={{
                  bgcolor: isFirst
                    ? '#2E7D32'
                    : isLast
                    ? '#D32F2F'
                    : '#1976D2',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {STOP_ICONS[stop.type] || <StopIcon />}
              </TimelineDot>
              {!isLast && <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent sx={{ pb: 2 }}>
              <Typography variant="body2" fontWeight={600}>
                {stop.city || stop.shipment_destination || `Durak ${stop.sequence}`}
              </Typography>
              {stop.shipment_origin && stop.shipment_destination && (
                <Typography variant="caption" color="text.secondary" display="block">
                  {stop.shipment_origin} → {stop.shipment_destination}
                </Typography>
              )}
              <Chip
                label={traffic.label}
                size="small"
                sx={{
                  mt: 0.5,
                  bgcolor: traffic.bgcolor,
                  color: '#fff',
                  height: 20,
                  fontSize: '0.65rem',
                }}
              />
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};

export default RouteStopTimeline;
