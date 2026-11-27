import { useCallback, useState } from 'react'
import { BgmMode, BgmTrackId, duelSfx } from '../audio'

export function useDuelAudio() {
  const [sfxEnabled, setSfxEnabled] = useState(() => duelSfx.isSfxEnabled())
  const [bgmMuted, setBgmMuted] = useState(() => duelSfx.isBgmMuted())
  const [bgmVolume, setBgmVolume] = useState(() => duelSfx.getBgmVolume())
  const [bgmMode, setBgmMode] = useState<BgmMode>(() => duelSfx.getBgmMode())
  const [activeTrackId, setActiveTrackId] = useState<BgmTrackId>(() => duelSfx.getActiveTrackId())

  const toggleSfx = useCallback(() => {
    setSfxEnabled((prev) => {
      const next = !prev
      duelSfx.setSfxEnabled(next)
      return next
    })
  }, [])

  const toggleBgmMute = useCallback(() => {
    setBgmMuted((prev) => {
      const next = !prev
      duelSfx.setBgmMuted(next)
      setBgmVolume(duelSfx.getBgmVolume())
      return next
    })
  }, [])

  const changeBgmVolume = useCallback((vol: number) => {
    duelSfx.setBgmVolume(vol)
    setBgmVolume(duelSfx.getBgmVolume())
    setBgmMuted(duelSfx.isBgmMuted())
  }, [])

  const changeBgmMode = useCallback((mode: BgmMode) => {
    duelSfx.playHover()
    duelSfx.setBgmMode(mode)
    setBgmMode(duelSfx.getBgmMode())
    setActiveTrackId(duelSfx.getActiveTrackId())
  }, [])

  const selectBgmTrack = useCallback((trackId: BgmTrackId) => {
    duelSfx.playHover()
    duelSfx.selectTrack(trackId)
    setBgmMode(duelSfx.getBgmMode())
    setActiveTrackId(duelSfx.getActiveTrackId())
    setBgmMuted(duelSfx.isBgmMuted())
  }, [])

  return {
    sfxEnabled,
    bgmMuted,
    bgmVolume,
    bgmMode,
    activeTrackId,
    setActiveTrackId,
    toggleSfx,
    toggleBgmMute,
    changeBgmVolume,
    changeBgmMode,
    selectBgmTrack,
  }
}
